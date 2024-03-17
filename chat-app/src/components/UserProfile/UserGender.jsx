const Gender = ({ gender, setGender }) => {
    const handleGenderChange = (e) => {
      setGender(e.target.value);
    };
  
    return (
      <div className="user-gender-container">
        <div>
          <h4>Gender</h4>
        </div>
        <select
          name="gender"
          id="select-gender"
          value={gender}
          onChange={handleGenderChange}
        >
          <option value="none">None</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="prefer-not-tosay">Prefer not to say</option>
        </select>
      </div>
    );
  };

  export default Gender;