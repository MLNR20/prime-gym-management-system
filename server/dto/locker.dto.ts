// src/dto/locker.dto.ts
export interface CreateLockerRequestDto {
  lockerNumber: number;
}

export interface UpdateLockerRequestDto {
  locker_number?: number;
  is_active?: boolean;
}

export interface LockerResponseDto {
  _id: string;
  locker_number: number;
  is_active: boolean;
  // Not present on the slim availability projection.
  createdAt?: Date;
  updatedAt?: Date;
}

export function toUpdateLockerData(dto: UpdateLockerRequestDto) {
  const data: UpdateLockerRequestDto & { updatedAt: Date } = { updatedAt: new Date() };
  if (dto.locker_number !== undefined) data.locker_number = Number(dto.locker_number);
  if (dto.is_active !== undefined) data.is_active = dto.is_active;
  return data;
}

export function toLockerResponseDto(locker: any): LockerResponseDto {
  const source = locker.toObject ? locker.toObject() : locker;
  return {
    _id: String(source._id),
    locker_number: Number(source.locker_number),
    is_active: Boolean(source.is_active),
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
}

export function toLockerListResponseDto(lockers: any[]): LockerResponseDto[] {
  return lockers.map(toLockerResponseDto);
}

export function toLockerPageResponseDto<M>(page: { data: any[]; meta: M }) {
  return { data: toLockerListResponseDto(page.data), meta: page.meta };
}
