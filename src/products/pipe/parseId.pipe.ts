import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import {RpcBadErrorException} from "../../common/errors/rpc.error"
@Injectable()
export class ParseIdPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata) {
    const val = parseInt(value, 10);

    if (val <= 0) throw new RpcBadErrorException('ID must be positive') 
  
    if (isNaN(val)) throw new RpcBadErrorException('ID must be positive')
    

    return val;
  }
}
