import { BadRequestException, Param, PipeTransform } from '@nestjs/common';
import { isValid as isValidUlid } from 'ulidx';

class ParseUlidPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isValidUlid(value)) {
      throw new BadRequestException('Validation failed (ULID is expected)');
    }

    return value;
  }
}

export const UlidParam = (name: string) => Param(name, new ParseUlidPipe());
