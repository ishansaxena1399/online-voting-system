import AdminMenu from "../components/adminMenu";
import Layout from "../components/Layout";
import { Grid } from "@mui/material";
import useGlobalState from "../store";
import TimerComponent from "../components/timerComponent";
import AddTimer from "../components/addTimer";

const AdminHome = () => {

  const {
    state: {
      user: {
        details
      },
      timeStarted
    }
  } = useGlobalState();

  return (
    <Layout>
      <Grid container className="containerGrid" spacing={2} >
        <Grid item md={2} className="adminMenuGrid" >
          <AdminMenu />
        </Grid>

        <Grid item md={10} xs={12} sm={12} >
          <div className="mainContentDiv" >
            <div className="upperContentDiv" >
              <p >
                Hello, {details.name} 👋
              </p>
            </div>

            <div className="lowerContentDiv" >
              {
                timeStarted ?
                <TimerComponent />
                :
                <AddTimer />
              }
            </div>
          </div>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default AdminHome;