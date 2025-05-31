import fs from 'node:fs'
import path from 'node:path'

import { Injectable } from '@nestjs/common'
import Docxtemplater from 'docxtemplater'
import ImageModule from 'docxtemplater-image-module-free'
import got from 'got'
import PizZip from 'pizzip'
import xml2 from 'xml2js'

import type { RenderProjectDocDTO } from './dto'

const content = fs.readFileSync(path.join(process.cwd(), 'src/assets/template.docx'))
const zip = new PizZip(content)

function createHyperlink(anchor: string, text: string) {
  return {
    'w:hyperlink': [
      {
        $: {
          'w:anchor': anchor,
          'w:history': '1'
        },
        'w:r': [
          {
            'w:rPr': [
              {
                'w:rStyle': [
                  {
                    $: { 'w:val': 'Hyperlink' }
                  }
                ]
              }
            ],
            'w:t': [text]
          }
        ]
      }
    ]
  }
}

function createBookMark(id: string, bookmark: string, text: string) {
  return {
    'w:bookmarkStart': [
      {
        $: {
          'w:id': id,
          'w:name': bookmark
        }
      }
    ],
    'w:r': [
      {
        'w:t': [text]
      }
    ],
    'w:bookmarkEnd': [
      {
        $: {
          'w:id': id
        }
      }
    ]
  }
}

@Injectable()
export class DocConsumerService {
  async render(data: RenderProjectDocDTO) {
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      modules: [
        new ImageModule({
          async getImage(tagValue: string) {
            const res = await got(tagValue, { responseType: 'buffer' })
            return res.body
          },
          getSize: () => [400, 300]
        })
      ]
    })

    await doc.renderAsync(data)
    const buffer = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' })
    return await this.processBookmarks(buffer)
  }

  async processBookmarks(docxBuffer: Buffer): Promise<Buffer> {
    const zip = new PizZip(docxBuffer)
    const xmlContent = zip.files['word/document.xml'].asText()

    // 3. 解析并修改 XML
    const result = await xml2.parseStringPromise(xmlContent, { explicitArray: true, preserveChildrenOrder: true })
    const body = result['w:document']['w:body'][0]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paragraphs = body['w:p'] as any[]

    labelParagraphs: for (const [index, wp] of paragraphs.entries()) {
      const wrs = wp['w:r']
      if (!wrs) continue

      const lineData: { data: unknown; text: string[] }[] = []

      labelWrs: for (const wr of wrs) {
        const wts = wr['w:t']
        if (!wts) continue
        const handle: { data: unknown; text: string[] } = {
          data: wts,
          text: []
        }
        let empty = false

        labelWts: for (const wt of wts) {
          if (!wt) {
            empty = true
            break labelWts
          }

          if (typeof wt === 'string') {
            handle.text.push(wt)
            continue
          }

          if (typeof wt === 'object') {
            handle.text.push(wt._)
          }
        }

        if (!empty) lineData.push(handle)
      }

      const lineText = lineData.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue.text.join('')
      }, '')

      if (lineText.startsWith('<anchor')) {
        const result = lineText.match(/<anchor\|(?<anchor>[^>]+)>(?<text>.*?)<\/anchor>/)
        if (!result) continue
        const anchor = result.groups!.anchor
        const text = result.groups!.text
        paragraphs[index] = createHyperlink(anchor, text)
      }

      if (lineText.startsWith('<bookmark')) {
        const result = lineText.match(/<bookmark\|(?<bookmark>[^>]+)>(?<text>.*?)<\/bookmark>/)
        if (!result) continue
        const bookmark = result.groups!.bookmark
        const id = bookmark.match(/(?<id>\d+$)/)!.groups!.id
        const text = result.groups!.text
        paragraphs[index] = createBookMark(id, bookmark, text)
      }
    }

    // 5. 重新生成 XML
    const builder = new xml2.Builder()
    const newXml = builder.buildObject(result)
    zip.file('word/document.xml', Buffer.from(newXml))

    // 6. 返回最终 Buffer
    return zip.generate({ type: 'nodebuffer' })
  }
}
