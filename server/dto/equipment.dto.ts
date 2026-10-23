// src/dto/equipment.dto.ts
export type EquipmentStatusDto = "Active" | "Inactive" | "For Repair" | "Under Repair";

export interface CreateEquipmentRequestDto {
  equipment_name: string;
  equipment_status?: EquipmentStatusDto;
}

export type UpdateEquipmentRequestDto = Partial<CreateEquipmentRequestDto>;

export interface EquipmentResponseDto {
  _id: string;
  equipment_name: string;
  equipment_status?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Only the fields a client may set; anything else in the body is dropped.
export function toCreateEquipmentData(dto: CreateEquipmentRequestDto) {
  const data: CreateEquipmentRequestDto = { equipment_name: dto.equipment_name };
  if (dto.equipment_status !== undefined) data.equipment_status = dto.equipment_status;
  return data;
}

export function toUpdateEquipmentData(dto: UpdateEquipmentRequestDto) {
  const data: UpdateEquipmentRequestDto & { updatedAt: Date } = { updatedAt: new Date() };
  if (dto.equipment_name !== undefined) data.equipment_name = dto.equipment_name;
  if (dto.equipment_status !== undefined) data.equipment_status = dto.equipment_status;
  return data;
}

export function toEquipmentResponseDto(equipment: any): EquipmentResponseDto {
  const source = equipment.toObject ? equipment.toObject() : equipment;
  return {
    _id: String(source._id),
    equipment_name: source.equipment_name,
    equipment_status: source.equipment_status,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
}

export function toEquipmentListResponseDto(equipment: any[]): EquipmentResponseDto[] {
  return equipment.map(toEquipmentResponseDto);
}

export function toEquipmentPageResponseDto<M>(page: { data: any[]; meta: M }) {
  return { data: toEquipmentListResponseDto(page.data), meta: page.meta };
}
