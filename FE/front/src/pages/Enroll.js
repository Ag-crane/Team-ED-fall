import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EnrollForm from '../components/EnrollForm';
import '../styles/pages/Enroll.css';

const Enroll = () => {
  return (
    <div>
      <Header />
      <form>
        <div className="enroll_form">
          <EnrollForm />
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default Enroll;