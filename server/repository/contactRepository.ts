import GenericRepository from "./genericRepository";
import Contacts, {IContactsDocument} from "../models/contact"

export class contactRepository extends GenericRepository<IContactsDocument>
{

}  

export default new contactRepository(Contacts);