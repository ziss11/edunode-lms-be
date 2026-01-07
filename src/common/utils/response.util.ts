import { HttpStatus } from '@nestjs/common';
import { BaseResponse } from '../responses/base.response';
import { MetaResponse } from '../responses/meta.response';

export class ResponseUtils {
  static success(
    message: string = 'Operation successful',
    statusCode: HttpStatus = HttpStatus.OK,
  ): BaseResponse<null> {
    return new BaseResponse<null>({
      success: true,
      statusCode,
      message,
      data: null,
    });
  }

  static successWithData<T>(
    data: T,
    message: string = 'Operation successful',
    statusCode: HttpStatus = HttpStatus.OK,
  ): BaseResponse<T> {
    return new BaseResponse<T>({
      success: true,
      statusCode,
      message,
      data,
    });
  }

  static successWithPagination<T>(
    data: T[],
    meta: MetaResponse,
    message: string = 'Operation successful',
    statusCode: HttpStatus = HttpStatus.OK,
  ): BaseResponse<T[]> {
    return new BaseResponse<T[]>({
      success: true,
      statusCode,
      message,
      data,
      meta,
    });
  }

  static created<T>(
    data: T,
    message: string = 'Resource created successfully',
  ): BaseResponse<T> {
    return this.successWithData(data, message, HttpStatus.CREATED);
  }

  static updated<T>(
    data: T,
    message: string = 'Resource updated successfully',
  ): BaseResponse<T> {
    return this.successWithData(data, message, HttpStatus.OK);
  }

  static deleted<T>(
    data: T,
    message: string = 'Resource deleted successfully',
  ): BaseResponse<T> {
    return this.successWithData(data, message, HttpStatus.OK);
  }
}
