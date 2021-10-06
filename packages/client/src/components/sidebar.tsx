import React from "react"
import {NavLink} from "react-router-dom"
import useCloseOnClickOrEsc from "../hooks/useCloseOnClickOrEsc"
import logoPurp from "../images/logomark-purp.svg"
import {iconMenu} from "./icons.js"

function Sidebar(props) {
  const {node, open: showSidebar, setOpen: setShowSidebar} = useCloseOnClickOrEsc()

  function closeSidebar() {
    setShowSidebar("")
  }

  function toggleSidebar() {
    if (showSidebar === "") {
      setShowSidebar("open")
    } else {
      setShowSidebar("")
    }
  }

  return (
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'RefObject<HTMLElement>' is not assignable to... Remove this comment to see the full error message
    <div ref={node} className={`sidebar ${showSidebar}`}>
      <button className="open-sidebar" onClick={toggleSidebar}>
        {iconMenu}
      </button>
      <a href="/">
        <img className="sidebar-logo" src={logoPurp} alt="Goldfinch" />
      </a>
      <nav>
        <NavLink to="/earn" onClick={closeSidebar}>
          Earn
        </NavLink>
        <NavLink to="/borrow" onClick={closeSidebar}>
          Borrow
        </NavLink>
        <NavLink to="/transactions" onClick={closeSidebar}>
          Transactions
        </NavLink>
      </nav>
    </div>
  )
}

export default Sidebar
