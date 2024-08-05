import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { message, Button, Table } from "antd";
import { showLoading, hideLoading } from "../../features/Loader/loaderSlice";
import axios from 'axios';
import { config } from "../../App";

const TheatresTable = () => {
  const [theatres, setTheatres] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`${config.endpoint}/theatres/get-all-theatres`); //(/get-all-theatres)
      if (response.data.success) {
        const allTheatres = response.data.data;
        setTheatres(
          allTheatres.map(function (item) {
            return { ...item, key: `theatre${item._id}` };
          })
        );
      } else {
        message.error(response.data.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      message.error(err.message);
    }
  };

  const handleStatusChange = async (theatre) => {
    try {
      dispatch(showLoading());
      let values = {
        ...theatres,
        theatreId: theatre._id,
        isActive: !theatre.isActive,
      };
      const response = await axios.put(`${config.endpoint}/theatres/update-theatre`,{
        ...values
      }) 
      console.log(response.data, theatre);
      if (response.data.success) {
        message.success(response.data.message);
        getData();
      }
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      message.error(err.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Owner",
      dataIndex: "owner",
      render: (text, data) => {
        return data.owner && data.owner.name;
      },
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, data) => {
        if (data.isActive) {
          return "Approved";
        } else {
          return "Pending/ Blocked";
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, data) => {
        return (
          <div className="d-flex align-items-center gap-10">
            {data.isActive ? (
              <Button onClick={() => handleStatusChange(data)}>Block</Button>
            ) : (
              <Button onClick={() => handleStatusChange(data)}>Approve</Button>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {theatres && theatres.length > 0 && (
        <Table dataSource={theatres} columns={columns} />
      )}
    </>
  );
};

export default TheatresTable;