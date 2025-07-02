declare type FormRule<T> = {
  [k in keyof T]: import('naive-ui').FormItemRule | import('naive-ui').FormItemRule[]
}

declare namespace Upload {
  interface RemoveData {
    file: import('naive-ui').UploadSettledFileInfo
    fileList: import('naive-ui').UploadSettledFileInfo[]
  }
}
