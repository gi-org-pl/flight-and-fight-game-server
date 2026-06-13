import { BadRequestException, Param, PipeTransform } from '@nestjs/common';

const JOIN_CODE_PATTERN = /^[0-9A-HJKMNP-TV-Z]{8}$/;

class ParseJoinCodePipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const code = value.toUpperCase();

    if (!JOIN_CODE_PATTERN.test(code)) {
      throw new BadRequestException(
        'Validation failed (join code is expected)',
      );
    }

    return code;
  }
}

export const JoinCodeParam = (name: string) =>
  Param(name, new ParseJoinCodePipe());
