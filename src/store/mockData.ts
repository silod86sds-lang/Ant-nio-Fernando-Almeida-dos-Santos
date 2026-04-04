export type Agent = {
  id: string;
  nif: string;
  name: string;
  password: string;
};

export type Citizen = {
  bi: string;
  name: string;
  photo: string;
  licenseStatus: 'Válida' | 'Expirada' | 'Suspensa' | 'Inexistente';
  licenseCategory: string;
  licenseExpiry: string;
};

export type Vehicle = {
  plate: string;
  brand: string;
  model: string;
  ownerBi: string;
  taxPaid: boolean;
  insuranceActive: boolean;
};

export type InfractionType = {
  id: string;
  description: string;
  value: number;
};

export type InfractionRecord = {
  id: string;
  type: 'warning' | 'fine';
  date: string;
  description: string;
  value: number;
  status: 'Pago' | 'Não pago' | 'Em atraso' | 'Aviso';
  citizenBi: string;
  vehiclePlate?: string;
  agentId: string;
  deadline: string | null;
  code?: string;
};

export const agents: Agent[] = [
  { id: '1', nif: '123456789', name: 'Agente Silva', password: '123' },
  { id: '2', nif: '987654321', name: 'Agente Santos', password: '123' },
];

export const citizens: Citizen[] = [
  { bi: '000000000LA000', name: 'João Manuel', photo: 'https://i.pravatar.cc/150?u=joao', licenseStatus: 'Válida', licenseCategory: 'Ligeiro', licenseExpiry: '2028-05-10' },
  { bi: '111111111LA111', name: 'Maria Fernandes', photo: 'https://i.pravatar.cc/150?u=maria', licenseStatus: 'Suspensa', licenseCategory: 'Pesado', licenseExpiry: '2025-10-20' },
  { bi: '222222222LA222', name: 'Carlos Pedro', photo: 'https://i.pravatar.cc/150?u=carlos', licenseStatus: 'Expirada', licenseCategory: 'Motociclo', licenseExpiry: '2023-01-15' },
];

export const vehicles: Vehicle[] = [
  { plate: 'LD-12-34-AA', brand: 'Toyota', model: 'Hilux', ownerBi: '000000000LA000', taxPaid: true, insuranceActive: true },
  { plate: 'LD-99-88-BB', brand: 'Hyundai', model: 'i10', ownerBi: '111111111LA111', taxPaid: false, insuranceActive: false },
];

export const infractionsList: InfractionType[] = [
  { id: 'inf_1', description: 'Excesso de velocidade', value: 15000 },
  { id: 'inf_2', description: 'Falta de cinto de segurança', value: 10000 },
  { id: 'inf_3', description: 'Uso de telemóvel', value: 12000 },
  { id: 'inf_4', description: 'Estacionamento proibido', value: 8000 },
  { id: 'inf_5', description: 'Falta de seguro', value: 25000 },
];

export const initialInfractions: InfractionRecord[] = [
  { id: '1', type: 'fine', date: '2024-03-01T10:00:00Z', description: 'Excesso de velocidade', value: 15000, status: 'Em atraso', citizenBi: '111111111LA111', vehiclePlate: 'LD-99-88-BB', agentId: '1', deadline: '2024-03-16T10:00:00Z', code: 'MULTA-001' },
  { id: '2', type: 'warning', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), description: 'Falta de cinto de segurança', value: 0, status: 'Aviso', citizenBi: '000000000LA000', vehiclePlate: 'LD-12-34-AA', agentId: '1', deadline: null },
];
