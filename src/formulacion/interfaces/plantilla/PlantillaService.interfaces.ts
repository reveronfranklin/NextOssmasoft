import { IAlertMessageDto } from 'src/interfaces/alert-message-dto';
import { IApiResponse } from 'src/interfaces/api-response-dto';

import { DTOProcesoDetalleFindAll, IProcesoDetalleFindAllResponse } from 'src/formulacion/interfaces/plantilla/ProcesoDetalleFindAll.interfaces'
import { DTOProcesoFindAll, IProcesoFindAllResponse } from 'src/formulacion/interfaces/plantilla/ProcesoFindAll.interfaces'
import { DTOGetAllByCodigoDetalleProceso, IGetAllByCodigoDetalleProcesoResponse } from 'src/formulacion/interfaces/plantilla/GetAllByCodigoDetalleProceso.interfaces'

import { CreatePlantillaDTO, IPlantillaCreateResponse } from 'src/formulacion/interfaces/plantilla/Create.interfaces';
import { UpdatePlantillaDTO, IPlantillaUpdateResponse } from 'src/formulacion/interfaces/plantilla/Update.interfaces';
import { DeletePlantillaDTO, IPlantillaDeleteResponse} from 'src/formulacion/interfaces/plantilla/Delete.interfaces';

export interface IPlantillaService {
  error: string;
  message: IAlertMessageDto;
  loading: boolean;
  getListProcesos: (filters: DTOProcesoFindAll) => Promise<IApiResponse<IProcesoFindAllResponse[]>>;
  getListDetalleProcesos: (filters: DTOProcesoDetalleFindAll) => Promise<IApiResponse<IProcesoDetalleFindAllResponse[]>>;
  getPlantillasByDetalleProceso: (filters: DTOGetAllByCodigoDetalleProceso) => Promise<IApiResponse<IGetAllByCodigoDetalleProcesoResponse[]>>;

  // getListPlantillas: (filters: DTOGetAllPlantillas) => Promise<IApiResponse<IPlantillaGetAllResponse[]>>;
  createPlantilla: (data: CreatePlantillaDTO) => Promise<IApiResponse<IPlantillaCreateResponse>>;
  updatePlantilla: (data: UpdatePlantillaDTO) => Promise<IApiResponse<IPlantillaUpdateResponse>>;
  deletePlantilla: (data: DeletePlantillaDTO) => Promise<IApiResponse<IPlantillaDeleteResponse>>;
}
