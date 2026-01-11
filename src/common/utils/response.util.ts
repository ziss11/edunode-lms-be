import {
  BaseListResponse,
  BaseObjectResponse,
} from '../responses/base.response';
import { MetaResponse } from '../responses/meta.response';

export class ResponseUtils {
  static success(): BaseObjectResponse<null> {
    return new BaseObjectResponse<null>(null);
  }

  static successWithData<T>(data: T): BaseObjectResponse<T> {
    return new BaseObjectResponse<T>(data);
  }

  static successWithPagination<T>(
    data: T[],
    meta: MetaResponse,
  ): BaseListResponse<T> {
    return new BaseListResponse<T>(data, meta);
  }
}
