import { IAlertMessageDto } from 'src/interfaces/alert-message-dto';
import { IApiResponse } from 'src/interfaces/api-response-dto';
import { DTOVariableGetAll, IVariableGetAllResponse } from 'src/formulacion/interfaces/variable/GetAll.interfaces'
import { DTOVariableCreate, IVariableCreateResponse } from 'src/formulacion/interfaces/variable/Create.interfaces'
import { DTOVariableUpdate, IVariableUpdateResponse } from 'src/formulacion/interfaces/variable/Update.interfaces'
import { DTOVariableDelete, IVariableDeleteResponse } from 'src/formulacion/interfaces/variable/Delete.intrefaces'

export interface IVariableService {
  error: string;
  message: IAlertMessageDto;
  loading: boolean;
  getListVariables: (filters: DTOVariableGetAll) => Promise<IApiResponse<IVariableGetAllResponse[]>>;
  createVariable: (filters: DTOVariableCreate) => Promise<IApiResponse<IVariableCreateResponse>>;
  updateVariable: (filters: DTOVariableUpdate) => Promise<IApiResponse<IVariableUpdateResponse>>;
  deleteVariable: (filters: DTOVariableDelete) => Promise<IApiResponse<IVariableDeleteResponse>>;
}
