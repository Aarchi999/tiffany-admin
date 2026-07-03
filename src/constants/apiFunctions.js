import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import API from "../http/api";

// get all countries
export const fetchCountries = async (setLoading, setCountries) => {
  try {
    setLoading(true);
    const response = await API.post("country");
    if (response.status === 200) {
      setCountries(response?.data);
    }
    else {
      toast.error(response?.message);
      console.error("Error fetching countries:", response?.message);
    }
  } catch (error) {
    toast.error(error.message);
    console.error("Something went wrong!:", error.message);
  } finally {
    setLoading(false);
  }
};

// get all states
export const fetchStates = async (setLoading, countryId, setSelectedCountry, setStates) => {
  try {
    setLoading(true);
    setSelectedCountry(countryId);
    const response = await API.post(`state`, { id: countryId });
    if (response.status === 200) {
      setStates(response?.data);
    }
    else {
      toast.error(response?.message);
      console.error("Error fetching states:", response?.message);
    }
  } catch (error) {
    toast.error(error.message);
    console.error("Something went wrong!:", error.message);
  } finally {
    setLoading(false);
  }
};

// get all cities
export const fetchCities = async (setLoading, stateId, setSelectedState, setCities) => {
  try {
    setLoading(true);
    setSelectedState(stateId);
    const response = await API.post(`city`, { id: stateId });
    if (response.status === 200) {
      setCities(response?.data);
    }
    else {
      toast.error(response?.message);
      console.error("Error fetching cities:", response?.message);
    }
  } catch (error) {
    toast.error(error.message);
    console.error("Something went wrong!:", error.message);
  } finally {
    setLoading(false);
  }
};

// get the appointment types
export const fetchAppointmentType = async (setLoading, setAppointmentTypes) => {
  try {
    setLoading(true);
    const response = await API.post("appointment-type");
    if (response?.status === 200) {
      setAppointmentTypes(response.data);
    } else {
      toast.error(response?.message);
      console.error("Error fetching appointment types!", response?.message);
    }
  } catch (error) {
    toast.error(error.message);
    console.error("Something went wrong!", error.message);
  } finally {
    setLoading(false);
  }
};

// get all doctors
export const fetchDoctor = async (setLoading, setDoctor) => {
  try {
    setLoading(true);
    const response = await API.post("doctor");
    if (response?.status === 200) {
      setDoctor(response?.data);
    } else {
      toast.error(response?.message);
      console.error("Error fetching doctors!", response?.message);
    }
  } catch (error) {
    toast.error(error.message);
    console.error("Something went wrong!", error.message);
  } finally {
    setLoading(false);
  }
};

// fetching listing data
export const fetchListingData = async (apiEndpoint, setLoading, setList, setCurrPage, setTotalPages) => {
  setLoading(true);
  try {
    const response = await API.post({ apiEndpoint });
    if (response?.status === 200) {
      setList(response?.data);
      setCurrPage(response?.pagination.current_page);
      setTotalPages(response?.pagination.total_pages);
    } else {
      toast.error(response?.message);
      console.error("Error while fetching data!", response?.message);
    }
  } catch (error) {
    toast.error("Apologies, unable to fulfill your request now. Please try again later.");
    console.error(error.message);
  } finally {
    setLoading(false);
  }
};

// confirm action
export const confirmAction = (message, data, functionToRun) => {
  confirmAlert({
    title: 'Confirm Action',
    message: message,
    buttons: [
      {
        label: "Yes",
        onClick: () => functionToRun(data),
      },
      {
        label: "No",
      },
    ],
  });
};

// change option in select
export const handleSelectChange = async (setLoading, details, apiFunctionCall) => {
  setLoading(true);
  try {
    const response = await API.post("statusChangeAction", details);

    if (response?.status === 200) {
      toast.success(response?.message || "Status changed successfully!");
      apiFunctionCall();
    } else {
      toast.error(response?.message);
      console.error("Failed to update:", response?.message);
    }
  } catch (error) {
    toast.error(error?.message);
    console.error("There was a problem with the fetch operation:", error?.message);
  } finally {
    setLoading(false);
  }
};

// change option in sort
export const handleSortChange = async (details, apiFunctionCall) => {
  setLoading(true);
  try {
    const response = await API.post("sortChangeAction", details);

    if (response?.status) {
      toast.success(response?.message);
      apiFunctionCall();
    } else {
      toast.error(response?.message);
      console.error("Failed to fetch data:", response?.message);
    }
  } catch (error) {
    toast.error(error?.message);
    console.error("There was a problem with the fetch operation:", error?.message);
  } finally {
    setLoading(false);
  }
};
