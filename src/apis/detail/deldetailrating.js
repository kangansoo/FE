import axios from "axios";

export const delReview = async(subsr, rating, review, rating_date) => {
    const result = await axios.post('http://1.220.201.108:8080/ratings', { //("http://localhost:30/ratings", { 
        subsr, rating, review, rating_date
    });
    return result;
}