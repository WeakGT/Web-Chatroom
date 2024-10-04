import React, { useContext, useEffect, useState } from 'react';
import { database } from '../firebase';
import { onChildAdded, ref, push, set } from 'firebase/database';
import { AuthContext } from '../context/AuthContext';
import './Groups.css';

function Groups({ onSelectGroup }) {
  const { user } = useContext(AuthContext);
  const [groups, setGroups] = useState(["Public"]);

  useEffect(() => {
    const groupListRef = ref(database, `chatroom/`);
    const unsub = onChildAdded(groupListRef, (snapshot) => {
      const group = snapshot.val();
      if (group.groupId)
        setGroups((prevGroups) => [...prevGroups, group]);
    });

    return () => unsub();
  }, []);

  const handleNewGroup = () => {
    const groupName = prompt("Input Group Name");
    try {
      if (!groupName.trim()) return;
    } catch (err) {
      // alert(err.message);
      return;
    }
    const groupListRef = ref(database, `chatroom/`);
    const groupId = push(groupListRef, {
      groupId: null,
      groupName: groupName,
      users: [user.uid]
    }).key;
    set(ref(database, `chatroom/${groupId}/groupId`), groupId);

    // Update groups state manually after adding new group
    setGroups(prevGroups => [...prevGroups, { groupId: groupId, groupName: groupName, users: [user.uid] }]);
  };

  return (
    <div className="groups">
      <div className="buttons">
        <button className="add-button" onClick={() => handleNewGroup()}>New Group</button>
      </div>
      <ul>
        {groups.map((group, index) => {
          if (!index) {
            return (
              <li key={index} onClick={() => onSelectGroup(["Public", "Public"])}>
                {"Public"}
              </li>
            );
          }
          else if (group.users.includes(user.uid)) {
            return (
              <li key={index} onClick={() => onSelectGroup([group.groupId, group.groupName])}>
                {group.users.includes(user.uid) && group.groupName}
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
}

export default Groups;
