import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth, database } from '../firebase';
import Groups from '../components/Groups';
import ChatRoom from '../components/ChatRoom';
import './Home.css';
import { ref, set, get } from 'firebase/database';

function Home() {
  const [selectedGroup, setSelectedGroup] = useState(["Public", "Public"]);

  const handleAddMember = async () => {
    if (selectedGroup[0] === "Public") {
      alert("This chatroom is public.");
      return;
    }

    const memberEmail = prompt("Input Member Email");
    try {
      if (!memberEmail.trim()) return;
    } catch (err) {
      // alert(err.message);
      return;
    }
    // Retrieve the chatroom data
    const chatroomRef = ref(database, `chatroom/${selectedGroup[0]}`);
    const chatroomSnapshot = await get(chatroomRef);
    const chatroomData = chatroomSnapshot.val();
  
    // Check if the member's email exists in the user database
    const usersRef = ref(database, 'users');
    const usersSnapshot = await get(usersRef);
    const usersData = usersSnapshot.val();
  
    let memberUID = null;
    for (const uid in usersData) {
      console.log(usersData[uid]);
      if (usersData[uid].email === memberEmail) {
        memberUID = uid;
        break;
      }
    }
  
    if (!memberUID) {
      alert("Member not found");
      return;
    }
  
    // Add the member's UID to the users array of the chatroom data
    const updatedUsers = [...chatroomData.users, memberUID];
  
    // Update the chatroom data in the database
    await set(ref(database, `chatroom/${selectedGroup[0]}/users`), updatedUsers);
  
    alert("Member added successfully");
  };

  return (
    <div className="home-container">
      <div className="groups-container">
        <div className="header">
          <h2>Groups</h2>
          <button className="sign-out-button" onClick={() => signOut(auth)}>Sign Out</button>
        </div>
        <Groups onSelectGroup={setSelectedGroup} />
      </div>
      <div className="chatroom-container">
        <div className="header">
          <h2>{selectedGroup[1]}</h2>
          <button className="add-button" onClick={() => {return handleAddMember()}}>Add Member</button>
        </div>
        <ChatRoom selectedGroup={selectedGroup[0]} />        
      </div>
    </div>
  );
}

export default Home;
