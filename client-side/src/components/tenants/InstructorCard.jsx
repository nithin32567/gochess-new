import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Tooltip,
} from "@material-tailwind/react";

export function InstructorCard({ instructor }) {
  console.log(instructor, "instructor inside the InstructorCard");
  return (
    <Card className="w-66 shadow-2xl">
      <CardHeader floated={false} className="">
        <img
          className="w-full h-full object-cover"
          src="https://imgs.search.brave.com/FtYHVsc4P8McEV3twQ6jBZOUqy36aRSvD5AM4DMVfjY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvNC9NYWxl/LVRlYWNoZXItUE5H/LUNsaXBhcnQucG5n"
          alt="profile-picture"
        />
      </CardHeader>
      <CardBody className="text-center">
        <Typography variant="h4" color="blue-gray" className="mb-2">
          {instructor.name}
        </Typography>
        <Typography color="blue-gray" className="font-medium" textGradient>
          Role : {instructor.role}
        </Typography>
      </CardBody>
      <CardFooter className="flex justify-center gap-7 pt-2"></CardFooter>
    </Card>
  );
}

export default InstructorCard;
