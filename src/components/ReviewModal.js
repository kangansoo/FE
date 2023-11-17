import React, {useState, useEffect} from 'react'
import Modal from 'react-modal';
import { Rating } from 'react-simple-star-rating'
import axios from "axios";
import { useParams } from 'react-router-dom';

export default function ReviewModal() {
    let {content_id}=useParams();
    const subsr= localStorage.getItem('subsr');

    //review get 요청 useState
    const [review, setReview] = useState();
    //rating get 요청 useState
    const [rating, setRating] = useState();

    //rating get요청
    useEffect(() => {
      const checkRatings = async () => {
        try {
          const response = await axios.get('http://localhost:30/ratings');
          const found = response.data.filter((item) => item.subsr === subsr && item.content_id === content_id);
          if (found.length > 0) {
            setRating(found[found.length-1].rating);
          } else{
            setRating(0);
          }
        } catch (error) {
          console.log(error);
        }
      };
      checkRatings();
    }, [subsr, content_id]);

    //review get요청
    useEffect(() => {
      const checkReviews = async () => {
        try {
          const response = await axios.get('http://localhost:30/reviews');
          const found = response.data.filter((item) => item.subsr === subsr && item.content_id === content_id);
          if (found.length > 0) {
            setReview(found[found.length-1].review);
          } else{
          }
        } catch (error) {
          console.log(error);
        }
      };
      checkReviews();
    }, [subsr, content_id]);

  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#000000';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleChange = ((e)=> {
    setReview(e.target.value);
  })

    const rate = (rating)=>{
        setRating(rating);
    }
    //POST Rating 
    const handleRating = async() => {
        const rating_info={subsr:subsr, content_id:content_id, rating:rating};
        await axios.post("http://localhost:30/ratings", rating_info);
    };

    const handleReview = async() => {
      if (review.length === 0) {
        setReview();
      }else{
        const review_info={subsr:subsr, content_id:content_id, review:review};
        await axios.post("http://localhost:30/reviews", review_info);
      }
    }

    const clickSubmit = async(e) => {
      if(rating === 0){
        alert("평점을 메겨주세요");
        e.preventDefault();
      }else{
        handleRating();
        handleReview();
      }
    }

  return (
    <div>
      <button onClick={openModal}>리뷰작성</button>
      
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        style={customStyles}
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>{content_id}</h2>
        <button onClick={closeModal}>×</button>
        <div>
        {<Rating
            fillColor="#A50034"
            size="35"
            initialValue={rating}
            onClick={rate}
            />}  
        </div>
        <form>
          <textarea
          maxLength={100}
          value={review}
          onChange={handleChange}
          placeholder='리뷰는 최대 100자까지 작성 가능합니다.'
          style={{width: '490px', height:'150px', border: '1px solid', tesxtAlign:'justify'}}
          />
          <button onClick={clickSubmit}>등록하기</button>
        </form>
      </Modal>
    </div>
  );
}

const customStyles = {
    content: {
      width: '500px',
      height: '500px',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };