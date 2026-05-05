export interface PageParams {
  [param: string]: any
}

export interface FilePageParams extends PageParams {
  file: string
  name: string
  path: string
  sourcePath: string
  root: {
    title: string
    path: string
    type: 'section' | 'page'
  }
}
