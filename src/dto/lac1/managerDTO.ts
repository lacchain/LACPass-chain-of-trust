import { IsNumber, IsString } from 'class-validator';

export class NewManagerDto {
  @IsString()
  did!: string;
  @IsNumber()
  validDays!: number;
}
