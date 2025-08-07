import { IAlertMessageDto } from 'src/interfaces/alert-message-dto';
import { IApiResponse, IApiFlexibleResponse } from 'src/interfaces/api-response-dto';
import { DTOGetAllFormula, IFormulaResponse} from 'src/formulacion/interfaces/formula/GetAll.interfaces'
import { DTOFormulaCreate, IFormulaCreateResponse} from 'src/formulacion/interfaces/formula/Create.interfaces'
import { DTOFormulaUpdate, IFormulaUpdateResponse } from 'src/formulacion/interfaces/formula/Update.intrefaces'
import { DTOFormulaDelete, IFormulaDeleteResponse } from 'src/formulacion/interfaces/formula/Delete.interfaces'

export interface IFormulaService {
  error: string;
  message: IAlertMessageDto;
  loading: boolean;
  getListFormulas: (filters: DTOGetAllFormula) => Promise<IApiResponse<IFormulaResponse[]>>;
  createFormula: (filters: DTOFormulaCreate) => Promise<IApiFlexibleResponse<IFormulaCreateResponse>>;
  updateFormula: (filters: DTOFormulaUpdate) => Promise<IApiFlexibleResponse<IFormulaUpdateResponse>>;
  deleteFormula: (filters: DTOFormulaDelete) => Promise<IApiFlexibleResponse<IFormulaDeleteResponse>>;
}