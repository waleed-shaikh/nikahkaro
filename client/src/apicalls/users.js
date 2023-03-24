

const { default: axiosInstance } = require(".");

//add user 
export const registerUser = async (payload) => {
        await axiosInstance.post('http://localhost:4000/api/users/register', payload, {
            withCredentials: true,
          }).then((res) => console.log(res));
}

//login user
export const loginUser = async (payload) => {
    try {
        const response = await axiosInstance.post('http://localhost:4000/api/users/login', payload, {
            withCredentials: true,
          });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

//get user
export const getUser = async () => {
    try {
        const response = await axiosInstance.post('/api/users/getuser');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
