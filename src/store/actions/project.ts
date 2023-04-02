import { v4 } from "uuid";

interface ProjectProps {
  title: string;
  image: string;
}
interface IProject {
  title: string;
  image: string;
  id: string;
  date: string;
}

interface IAddProject {
  type: string;
  payload: IProject;
}

export default function addProject(project: ProjectProps): IAddProject {
  const { title, image } = project;
  const date:Date = new Date();
  
  const newData: IProject = {
    title,
    date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
    image,
    id: v4(),
  };
  return {
    type: "projects/add",
    payload: newData,
  };
}
