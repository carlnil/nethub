import { SERVER, CONNECTED, QUERY, HOME, HISTORY, PAGES } from './constants'
import React, { useState, useEffect as onMount, createContext } from 'react'
import io from 'socket.io-client'

import Navbar from './components/Navbar'
import Login from './components/Login'
import Home from './components/Home'
import History from './components/History'
import Settings from './components/Settings'

export const Context = createContext()

export default function App() {
  const socket = io(SERVER)

  const [user, setUser] = useState(null)
  const [users, setUsers] = useState(null)
  const [media, setMedia] = useState(null)
  const [page, setPage] = useState(HOME)

  onMount(() => {
    socket.emit(CONNECTED, users => {
      setUsers(users)
    })
  }, [])

  const ActivePage = () => {
    if (user) {
      if (page === HOME) return <Home />
      else if (page === HISTORY) return <History />
      else return <Settings />
    } else return <Login />
  }

  return (
    <>
      <Navbar />
      <ActivePage />
    </>
  )
}

//   handleSearch = (e, user, filters) => {
//     e.preventDefault()
//     const term = e.target[0].value

//     if (term) {
//       const socket = this.state.socket
//       const vars = { term, ...filters, user }

//       socket.emit(query, vars, payload => {
//         this.setState({ ...payload })
//       })
//     }
//   }

//   render() {
//     const { user, users, pages, active, media } = this.state
//     const { loginUser, logoutUser, setPage, handleSearch } = this

//     return (
//       <div>
//         <Navbar
//           user={user}
//           pages={pages}
//           active={active}
//           logoutUser={logoutUser}
//           setPage={setPage}
//         />
//         {user.name ? (
//           active === 'Home' ? (
//             <Home user={user} onSearch={handleSearch} media={media} />
//           ) : active === 'History' ? (
//             <History user={user} />
//           ) : (
//             <Settings user={user} />
//           )
//         ) : (
//           <Login loginUser={loginUser} users={users} />
//         )}
//       </div>
//     )
//   }
// }
