import { v4 as uuidv4 } from "uuid";

interface IProject {
  title: string;
  date: string;
  image: string;
  id: string;
}

interface IAction {
  type: string;
  payload: {
    title: string;
    image: string;
    date:string
  };
}
interface IInitialState {
  projects: IProject[];
}
const initialState: IInitialState = {
  projects: [
    {
      title: "a",
      date: "teste",
      image:
        "",
      id: "dhskkask",
    },
    {
      title: "b",
      date: "teste2",
      image:
        "",
      id: "dhsk10c9",
    },
    {
      title: "Limão Gomes Pereira",
      date: "dpwpw",
      image:
        "",
      id: "dhskaldm3p1",
    },
  ],
};

function projectReducer(state = initialState, action: IAction): IInitialState {
  switch (action.type) {
    case "projects/add":
      const { title, image, date } = action.payload;
      return {
        ...state,
        projects: [
          ...state.projects,
          {
            title,
            date,
            image,
            id: uuidv4(),
          },
        ],
      };
    default:
      return state;
  }
}

export default projectReducer;
