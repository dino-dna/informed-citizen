import { FSA } from "../ui/types";

export type FromServer =
  | FSA<'REPORT_CREATED', { url: string }>
