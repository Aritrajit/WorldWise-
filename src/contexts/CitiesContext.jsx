import { createContext, useCallback, useContext, useEffect, useReducer } from "react";

const BASE_URL = 'http://localhost:9000'

const CitiesContext = createContext()

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
}

function reducer(state, action) {
  switch (action.type) {
    case 'loading': 
      return {
        ...state,
        isLoading: true
      }
    case 'cities/loaded':
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      }
    case 'city/loaded':
      return {
        ...state,
        isLoading: false,
        currentCity : action.payload
      }
    
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity : action.payload
      }
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) =>
          city.id !== action.payload),
        currentCity:{}
      };
    case 'rejected':    
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
      
    default:
      throw new Error("Unknown action type")
  }

}

function CitiesProvider({ children }) {

  const [{cities , isLoading , currentCity , error}, dispatch ]= useReducer(reducer,initialState )

    // const [cities, setCitites] = useState([])
    // const [isLoading, setIsLoading] = useState(false)
    // const [currentCity , setCurrentCity] = useState({})
  
  useEffect(function () {
    async function fetchCitites() {
      dispatch({type: 'loading'})
      try {
        // setIsLoading(true)
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        // setCitites(data);
        dispatch({ type: 'cities/loaded', payload: data })
      } catch {
        dispatch({
          type:'rejected',
          payload: 'There was a error loading cities...'
        })
      }//finally {
      //   setIsLoading(false)
      // }
    }
    fetchCitites()
  }, [])
    
  const getCity = useCallback(
    async function getCity(id) {
    // console.log(id,currentCity.id);
    if (Number(id) === currentCity.id) return;//if the same city details is clicked twice it checks the stored id and does not run the useEffect hook again

      dispatch({type: 'loading'})
        try {
            // setIsLoading(true)
            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();
            // setCurrentCity(data);
            dispatch({type: 'city/loaded' , payload: data})
        } catch {
          dispatch({
            type:'rejected',
            payload: 'There was a error loading city...'
          })
       } 
        
  }, [currentCity.id])
  
  async function createCity(newCity) {
        dispatch({type: 'loading'})
        try {
            // setIsLoading(true)
          const res = await fetch(`${BASE_URL}/cities`, {
            method: 'POST',
            body: JSON.stringify(newCity),
            headers: {
              "Content-Type": "application/json",
              },
            });
          const data = await res.json();
          // setCitites((cities) => [...cities , data])
          dispatch({type : 'city/created',payload: data});
        } catch {
            dispatch({
            type:'rejected',
            payload: 'There was a error creating city...'
          })
        } 
        
  }
  
  async function deleteCity(id) {
        dispatch({type: 'loading'})
        try {
            // setIsLoading(true)
          await fetch(`${BASE_URL}/cities/${id}`, {
            method: 'DELETE',
            });
          
          //console.log(data);
          dispatch({type: 'city/deleted' , payload: id})
          // setCitites((cities) => cities.filter(city => 
          //   city.id !== id))
        } catch {
            dispatch({
            type:'rejected',
            payload: 'There was a error deleting city...'
          })
        } 
        
    }
    
    return <CitiesContext.Provider value={{
        cities : cities,
        isLoading: isLoading,
        error : error, 
        currentCity: currentCity,
        getCity: getCity,
        createCity: createCity,
        deleteCity:deleteCity
    }}>
       {children}
   </CitiesContext.Provider>
}

function useCities() {
    const context = useContext(CitiesContext)
    if(context === undefined) throw new Error('Cities context was used outisde cities provider')
    return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export {CitiesProvider , useCities }