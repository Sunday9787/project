export class RequestList {
  constructor(
    public current = 1,
    public size = 10
  ) {}
}

export class ResponsePage<T> {
  loading = true
  total = 0
  list: T[] = []
}
