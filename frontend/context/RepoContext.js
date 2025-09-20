'use client';
const { useContext, createContext, useState } = require("react");

const RepoContext = createContext();

export function RepoProvider({children}){
    const [temp, setTemp] = useState('Ariful Islam Shakil');
    const [users, setUsers] = useState([]);
    const [accessToken, setAccessToken] = useState(null);

    return(
        <RepoContext.Provider
            value = {{
                temp, setTemp,
                users, setUsers,
                accessToken, setAccessToken

            }}
        >
            {children}
        </RepoContext.Provider>
    )

}

export function useRepo(){
    return useContext(RepoContext);
}