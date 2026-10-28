interface ContactRequest {
  method?: string;
  body?: unknown;
}

interface ContactResponse {
  setHeader(name: string, value: string): this;
  status(code: number): this;
  json(payload: unknown): this;
}

declare function contactHandler(
  request: ContactRequest,
  response: ContactResponse
): Promise<unknown>;

export default contactHandler;
