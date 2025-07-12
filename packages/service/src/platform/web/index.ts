export function download(response: AppResponse.Data<Blob>) {
  const el = document.createElement('a')
  const url = URL.createObjectURL(response.blob)

  el.href = url
  el.download = response.filename
  document.body.appendChild(el)

  el.click()

  URL.revokeObjectURL(url)
  document.body.removeChild(el)
}
