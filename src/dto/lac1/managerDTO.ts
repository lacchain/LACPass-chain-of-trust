import { IsNumber, IsString, Min } from 'class-validator';

export class NewManagerDto {
  @IsString()
  did!: string;
  @IsNumber()
  @Min(1)
  validDays!: number;
}
