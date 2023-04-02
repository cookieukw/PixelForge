import Container from "../components/Container";
import ListOptions from "../components/ListOptions";
import ListProjects from "../components/ListProjects";
import OptionItem from "../components/OptionItem";
import ProjectItem from "../components/ProjectItem";
import {
  FaFolderOpen,
  FaBookOpen,
  FaGamepad,
  FaUserCircle,
  FaGlobe,
  FaInfoCircle,
} from "react-icons/fa";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Button from "@mui/material/Button";
import Modal from "react-modal";
import { FaCheck, FaTimes } from "react-icons/fa";
import TextField from "@mui/material/TextField";

import { Dispatch } from "redux";
import { createTheme, Theme, ThemeProvider } from "@mui/material/styles";
import addProject from "../store/actions/project";
import { connect } from "react-redux";
import { useState } from "react";

interface IProject {
  date: string;
  image: string;
  title: string;
  id: string;
}
interface IAction {
  title: string;
  image: string;
}
interface AppProps {
  projects: IProject[];
  dispatch: Dispatch;
}

import style from "../components/css/App.module.css";

const theme: Theme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
  },
});

Modal.setAppElement("#root");
const App: React.FC<AppProps> = ({ projects, dispatch }) => {
  const [isOpen, setModal] = useState<boolean>(false);

  const toggleModal: () => void = (): void => {
    setModal(!isOpen);
  };
  const [projectName, setProjectName] = useState<string>("");

  const handleAddProject = (title: string, image: string): void => {
    dispatch(addProject({ title, image }));
  };
  return (
    <Container id={style["mainLayout"]}>
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        contentLabel="Create new project"
      >
        <h2>Add Project</h2>
        <TextField
          fullWidth
          required
          label="Project name"
          value={projectName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setProjectName(event.target.value)
          }
        />
        <Container
          style={{ height: "auto", padding: "1rem", columnGap: "1rem" }}
        >
          <ThemeProvider theme={theme}>
            <Button
              variant="contained"
              onClick={() => {
                handleAddProject(projectName, "/sun.png");
                setProjectName("");
                toggleModal();
              }}
              startIcon={<FaCheck />}
            >
              Adicionar
            </Button>
          </ThemeProvider>
          <Button
            variant="outlined"
            onClick={() => toggleModal}
            endIcon={<FaTimes />}
          >
            Cancelar
          </Button>
        </Container>
      </Modal>
      <ListOptions>
        <OptionItem icon={FaFolderOpen} title={"Projects"} />
        <OptionItem icon={FaBookOpen} title={"Tutorials"} />
        <OptionItem icon={FaGamepad} title={"Playground"} />
        <OptionItem icon={FaUserCircle} title={"Account"} />
        <OptionItem icon={FaGlobe} title={"Language"} />
        <OptionItem icon={FaInfoCircle} title={"About Us"} />
      </ListOptions>
      <Container id={style.projetLayout}>
        <Container id={style.projectBar}>
          <p>Projetos</p>

          <Button
            sx={{ margin: "0 1rem 0 1rem" }}
            variant="outlined"
            startIcon={<AiOutlinePlusCircle size={30} color="white" />}
            onClick={() => toggleModal}
          >
            New project
          </Button>
        </Container>
        <ListProjects>
          {projects.map((project: IProject) => (
            <ProjectItem
              key={project.id}
              title={project.title}
              date={project.date}
              image={project.image}
              id={project.id}
            />
          ))}
        </ListProjects>
      </Container>
    </Container>
  );
};

export default connect((state: { projects: IProject[] }) => ({
  projects: state.projects,
}))(App);
