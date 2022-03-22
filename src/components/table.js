import { useState } from "react";
import { TableCell, TableContainer, TableHead, TableRow, Paper, Table, TableBody, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalComponent from "./Modal";
import CandidateForm from "./candidateForm";
import { ADMIN_SERVICE } from "../services/admin.services";
import { useLocation } from "react-router-dom";
import AddPartyForm from "./addPartyForm";
import AddPositionForm from "./addPositionForm";
import { toast } from "react-toastify";
import useGlobalState from "../store";

const TableComponent = ({
  headerArray,
  dataArray,
  modalTitle,
  fetchData,
  canEdit,
  canDelete,
}) => {

  const { pathname } = useLocation();

  const {
    state: {
      parties,
      positions
    }
  } = useGlobalState();

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEditModal = (data) => {
    setEditData(data);
    setOpenEditModal(!openEditModal);
  }

  const handleDeleteData = async (id) => {
    try {
      setLoading(true);
      // TODO:: change service according to pathname here
      let responseData = null;
      if(pathname === "/candidates") {
        responseData = await ADMIN_SERVICE.deleteCandidate({ "dataId": id });
      }else if(pathname === "/voters") {
        responseData = await ADMIN_SERVICE.deleteVoter({ "dataId": id });
      }else if(pathname === "/parties") {
        responseData = await ADMIN_SERVICE.deleteParty({ "dataId": id });
      }else if(pathname === "/positions") {
        responseData = await ADMIN_SERVICE.deletePosition({ "dataId": id });
      }

      if (responseData.success) {
        fetchData();
        toast.success("Deleted successfully");
      } else {
        console.log("Unable to delete right now ", responseData);
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log("error in handleDeleteData of Table ", error);
    }
    setLoading(false);
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {
              headerArray.map((data, _) => (
                <TableCell className="tableHeadItem" key={data} >{data}</TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            pathname === "/candidates" &&
            dataArray.map((row, index) => (
              <TableRow
                key={row.name}
              >
                <TableCell align="left">
                  {index + 1}
                </TableCell>
                <TableCell align="left" >
                  {row.name}
                </TableCell>
                <TableCell align="left">{row.email}</TableCell>
                <TableCell align="left">
                  {
                    positions.length > 0 ?
                    positions.filter(position => position._id === row.position)[0]["name"]
                    :
                    "-"
                  }
                </TableCell>
                <TableCell align="left">
                  {
                    parties.length > 0
                    ?
                    parties.filter(party => party._id === row.party)[0]["name"]
                    :
                    "-"
                  }
                </TableCell>
                <TableCell align="left">{row.bio}</TableCell>
                <TableCell align="left">
                  <div className="tableActionsDiv" >
                    {
                      canEdit &&
                      <IconButton disabled={loading} onClick={() => handleEditModal(row)} >
                        <EditIcon className="editIcon" />
                      </IconButton>
                    }

                    {
                      canDelete &&
                      <IconButton disabled={loading} onClick={() => handleDeleteData(row._id)} >
                        <DeleteIcon className="deleteIcon" />
                      </IconButton>
                    }
                  </div>
                </TableCell>
              </TableRow>
            ))
          }

          {
            pathname === "/voters" &&
            dataArray.map((row, index) => (
              <TableRow
                key={row.name}
              >
                <TableCell align="left">
                  {index + 1}
                </TableCell>
                <TableCell align="left" >
                  {row.name}
                </TableCell>
                <TableCell align="left">{row.email}</TableCell>
                <TableCell align="left">{row.phone}</TableCell>
                <TableCell align="left">
                  <div className="tableActionsDiv" >
                    {
                      canEdit &&
                      <IconButton disabled={loading} onClick={() => handleEditModal(row)} >
                        <EditIcon className="editIcon" />
                      </IconButton>
                    }

                    {
                      canDelete &&
                      <IconButton disabled={loading} onClick={() => handleDeleteData(row._id)} >
                        <DeleteIcon className="deleteIcon" />
                      </IconButton>
                    }
                  </div>
                </TableCell>
              </TableRow>
            ))
          }

          {
            pathname === "/parties" &&
            dataArray.map((row, index) => (
              <TableRow
                key={row.name}
              >
                <TableCell align="left">
                  {index + 1}
                </TableCell>
                <TableCell align="left" >
                  {row.name}
                </TableCell>
                <TableCell align="left">
                  <div className="tableActionsDiv" >
                    {
                      canEdit &&
                      <IconButton disabled={loading} onClick={() => handleEditModal(row)} >
                        <EditIcon className="editIcon" />
                      </IconButton>
                    }

                    {
                      canDelete &&
                      <IconButton disabled={loading} onClick={() => handleDeleteData(row._id)} >
                        <DeleteIcon className="deleteIcon" />
                      </IconButton>
                    }
                  </div>
                </TableCell>
              </TableRow>
            ))
          }

          {
            pathname === "/positions" &&
            dataArray.map((row, index) => (
              <TableRow
                key={row.name}
              >
                <TableCell align="left">
                  {index + 1}
                </TableCell>
                <TableCell align="left" >
                  {row.name}
                </TableCell>
                <TableCell align="left">
                  <div className="tableActionsDiv" >
                    {
                      canEdit &&
                      <IconButton disabled={loading} onClick={() => handleEditModal(row)} >
                        <EditIcon className="editIcon" />
                      </IconButton>
                    }

                    {
                      canDelete &&
                      <IconButton disabled={loading} onClick={() => handleDeleteData(row._id)} >
                        <DeleteIcon className="deleteIcon" />
                      </IconButton>
                    }
                  </div>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      {
        openEditModal &&
        <ModalComponent
          open={openEditModal}
          onClose={handleEditModal}
          title={modalTitle}
          actionType="edit"
          editData={editData}
          fetchData={fetchData}
        >
          {
            pathname === "/candidates" ?
              <CandidateForm />
              :
              pathname === "/parties" ?
                <AddPartyForm />
                :
                pathname === "/positions" ?
                  <AddPositionForm />
                  :
                  null
          }
        </ModalComponent>
      }
    </TableContainer>
  )
}

export default TableComponent;