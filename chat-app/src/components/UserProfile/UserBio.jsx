
const Bio = ({ bio, setBio }) => {
  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  return (
    <div className="user-bio-container">
      <div>
        <h4>Bio</h4>
      </div>
      <textarea
        name="bio"
        id="user-bio"
        cols="73"
        rows="2"
        placeholder="Bio"
        value={bio}
        onChange={handleBioChange}
      ></textarea>
    </div>
  );
};

export default Bio;