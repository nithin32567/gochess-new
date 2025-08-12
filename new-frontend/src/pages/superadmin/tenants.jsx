import { useSelector } from "react-redux";

export default function Tenants() {
 const tenantDetails = useSelector((state) => state.superAdmin.tenantDetails);
 console.log(tenantDetails);
 return(
  <>Tenant list</>
 );
}