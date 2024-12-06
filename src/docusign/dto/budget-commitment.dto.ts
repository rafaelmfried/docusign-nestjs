export class BudgetCommitmentDto {
  fornecedor: {
    nome: string;
    email: string;
    endereco: string;
    cnpj: string;
  };
  representante: {
    nome: string;
    cpf: string;
    supervisor: string;
    identidade: string;
  };
  NumeroContrato: number;
  DataContrato: string;
  formaPagamento: string;
  valorVerba: string;
  valorEextenso: string;
  dataPagamento: string;
  grupoConta: string;
  conta: string;
  DataAssinatura: string;
  DataLiquidacao: string;
  testemunhas: {
    representante: {
      nome: string;
      cpf: string;
      email: string;
    };
    supervisor: {
      nome: string;
      cpf: string;
      email: string;
    };
  };
}
