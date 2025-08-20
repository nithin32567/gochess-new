import {
 Card,
 CardHeader,
 CardBody,
 CardFooter,
 Typography,
 Tooltip,
} from "@material-tailwind/react";

export function InstructorCard({ instructor, index }) {
 console.log(instructor, "instructor inside the InstructorCard");
 return (
  <>
   <tr>
    <th scope="row">{index + 1}</th>
    <td>
     <img
      className="w-full h-full object-cover"
      src="https://imgs.search.brave.com/FtYHVsc4P8McEV3twQ6jBZOUqy36aRSvD5AM4DMVfjY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvNC9NYWxl/LVRlYWNoZXItUE5H/LUNsaXBhcnQucG5n"
      alt="profile-picture"
     />
    </td>
    <td>{instructor.name}</td>
    <td>{instructor.role}</td>
    <td>
     <button className="edit">
      <i className="fa-solid fa-pen-to-square"></i>
     </button>
     <button className="delete">
      <i className="fa-solid fa-trash-can"></i>
     </button>
    </td>
   </tr>
  </>
 );
}

export default InstructorCard;
