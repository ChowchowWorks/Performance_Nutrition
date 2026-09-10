import { useEffect, useMemo, useState } from 'react';
import '../admin.css';
import './Members.css';
import { supabase } from '../../supabase';
import { db } from '../../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

const hardcodedFields = [
    "membershipTier",
    "assignedCoach",
    "renewalDate",
    "status"
];

const editableFields = [
  { value: 'calorieGoal', label: 'Calories Target (kcal)' },
  { value: 'weightGoal', label: 'Weight Target (kg)' },
  { value: 'stepGoal', label: 'Steps Target' },
  { value: 'proteinGoal', label: 'Protein Target (g)' },
  { value: 'waterGoal', label: 'Water Target (L)' },
  { value: 'carbsGoal', label: 'Carbohydrates Target (g)' },
  { value: 'fatGoal', label: 'Fat Target (g)' },
  { value: 'membershipTier', label: 'Membership Tier' },
  { value: 'assignedCoach', label: 'Assigned Coach' },
  { value: 'renewalDate', label: 'Renewal Date' },
  { value: 'status', label: 'Status' },
];

const goalFieldMap = {
    calorieGoal: "calorie_goal",
    weightGoal: "weight_goal",
    stepGoal: "step_goal",
    proteinGoal: "protein_goal",
    waterGoal: "water_goal",
    carbsGoal: "carbs_goal",
    fatGoal: "fat_goal"
};

export default function Members() {
  const [newMembers, setNewMembers] = useState([]);
const [newMemberUserId, setNewMemberUserId] = useState("");

const [newGoals, setNewGoals] = useState({
    calorie_goal: "",
    protein_goal: "",
    carbs_goal: "",
    fat_goal: "",
    weight_goal: "",
    step_goal: "",
    water_goal: ""
});

const [newMemberMessage, setNewMemberMessage] = useState("");

const [members, setMembers] = useState([]);
const [selectedUserId, setSelectedUserId] = useState("");

const [fieldName, setFieldName] = useState(editableFields[0].value);

const [newValue, setNewValue] = useState("");
const [savedMessage, setSavedMessage] = useState("");

useEffect(() => {
    const getMembers = async () => {
        const { data, error } = await supabase
            .from("nutrition_goals")
            .select(`
                user_id,
                calorie_goal,
                protein_goal,
                carbs_goal,
                fat_goal,
                weight_goal,
                step_goal,
                water_goal
            `)
            .order("user_id", { ascending: true });

        if (error) {
            console.error("Error fetching members:", error);
            return;
        }

        const fetchedMembers = data ?? [];

        const existingUserIds = new Set(
            fetchedMembers.map((member) => member.user_id)
        );

        // Fetch every registered user from Firestore
        const usersSnapshot = await getDocs(
            collection(db, "users")
        );

        const firestoreUsers = usersSnapshot.docs.map((userDoc) => ({
            user_id: userDoc.id,
            displayName:
                userDoc.data().displayName || "Unknown User"
        }));

        // Keep only users who DON'T already have nutrition_goals
        const usersWithoutGoals = firestoreUsers.filter(
            (user) => !existingUserIds.has(user.user_id)
        );

        setNewMembers(usersWithoutGoals);

        if (usersWithoutGoals.length > 0) {
            setNewMemberUserId(usersWithoutGoals[0].user_id);
        }

        const membersWithNames = await Promise.all(
            fetchedMembers.map(async (member) => {
                try {
                    const docRef = doc(
                        db,
                        "users",
                        member.user_id
                    );

                    const docSnap = await getDoc(docRef);
                    
                    if (docSnap.exists()) {
                        const userData = docSnap.data();

                        return {
                            ...member,
                            displayName:
                                userData.displayName || "Unknown User"
                        };
                    }
                } catch (error) {
                    console.error(
                        `Error fetching user ${member.user_id}:`,
                        error
                    );
                }

                return {
                    ...member,
                    displayName: "Unknown User"
                };
            })
        );

        setMembers(membersWithNames);

        if (membersWithNames.length > 0) {
            setSelectedUserId(
                membersWithNames[0].user_id
            );
        }
    };

    getMembers();
}, []);

const selectedMember = members.find(
    (member) => member.user_id === selectedUserId
);

const memberData = selectedMember
    ? {
        calorieGoal: `${selectedMember.calorie_goal} kcal`,
        weightGoal: `${selectedMember.weight_goal} kg`,
        stepGoal: `${selectedMember.step_goal} steps`,
        proteinGoal: `${selectedMember.protein_goal ?? 0} g`,
        waterGoal: `${selectedMember.water_goal} L`,
        carbsGoal: `${selectedMember.carbs_goal ?? 0} g`,
        fatGoal: `${selectedMember.fat_goal ?? 0} g`,

        membershipTier: "Gold",
        assignedCoach: "Coach Amelia",
        renewalDate: "15 Aug 2026",
        status: "Active"
    }
    : {
        calorieGoal: "—",
        weightGoal: "—",
        stepGoal: "—",
        proteinGoal: "—",
        waterGoal: "—",
        carbsGoal: "—",
        fatGoal: "—",

        membershipTier: "Gold",
        assignedCoach: "Coach Amelia",
        renewalDate: "15 Aug 2026",
        status: "Active"
    };

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, []);

  const selectedFieldLabel = editableFields.find((field) => field.value === fieldName)?.label || '';

  const handleSave = async (event) => {
      event.preventDefault();

      if (!selectedUserId || !fieldName || newValue.trim() === "") {
          setSavedMessage(
              "Please select a member, field, and new value before saving."
          );
          return;
      }

      const databaseColumn = goalFieldMap[fieldName];

      // Prevent the hardcoded fields from being updated for now
      if (!databaseColumn) {
          setSavedMessage(
              "This field is currently fixed and cannot be updated."
          );
          return;
      }

      const numericValue = Number(newValue);

      // All nutrition_goals columns are integers
      if (
          !Number.isFinite(numericValue) ||
          !Number.isInteger(numericValue) ||
          numericValue < 0
      ) {
          setSavedMessage(
              "Please enter a valid non-negative whole number."
          );
          return;
      }

      const { data, error } = await supabase
          .from("nutrition_goals")
          .update({
              [databaseColumn]: numericValue
          })
          .eq("user_id", selectedUserId)
          .select()
          .maybeSingle();

      if (error) {
          console.error("Error updating nutrition goal:", error);

          setSavedMessage(
              "Unable to update member data."
          );
          return;
      }

      if (!data) {
          setSavedMessage(
              "No member record was updated. Please check the user's record or permissions."
          );
          return;
      }

      // Update the locally stored member so preview changes immediately
      setMembers((previousMembers) =>
          previousMembers.map((member) =>
              member.user_id === selectedUserId
                  ? {
                      ...member,
                      [databaseColumn]: numericValue
                  }
                  : member
          )
      );

      setSavedMessage(
          `Saved ${selectedFieldLabel}.`
      );

      setNewValue("");
  };

  const handleNewGoalChange = (field, value) => {
      setNewGoals((previousGoals) => ({
          ...previousGoals,
          [field]: value
      }));
  };

  const handleCreateMemberGoals = async (event) => {
      event.preventDefault();

      if (!newMemberUserId) {
          setNewMemberMessage(
              "There are no users available to add."
          );
          return;
      }

      const parsedGoals = {
          calorie_goal:
              newGoals.calorie_goal === ""
                  ? 0
                  : Number(newGoals.calorie_goal),

          protein_goal:
              newGoals.protein_goal === ""
                  ? 0
                  : Number(newGoals.protein_goal),

          carbs_goal:
              newGoals.carbs_goal === ""
                  ? 0
                  : Number(newGoals.carbs_goal),

          fat_goal:
              newGoals.fat_goal === ""
                  ? 0
                  : Number(newGoals.fat_goal),

          weight_goal:
              newGoals.weight_goal === ""
                  ? 0
                  : Number(newGoals.weight_goal),

          step_goal:
              newGoals.step_goal === ""
                  ? 0
                  : Number(newGoals.step_goal),

          water_goal:
              newGoals.water_goal === ""
                  ? 0
                  : Number(newGoals.water_goal)
      };

      const values = Object.values(parsedGoals);

      if (
          values.some(
              (value) =>
                  !Number.isFinite(value) ||
                  !Number.isInteger(value) ||
                  value < 0
          )
      ) {
          setNewMemberMessage(
              "All goals must be valid non-negative whole numbers."
          );
          return;
      }

      const { data, error } = await supabase
          .from("nutrition_goals")
          .insert({
              user_id: newMemberUserId,
              ...parsedGoals
          })
          .select()
          .single();

      if (error) {
          console.error(
              "Error creating nutrition goals:",
              error
          );

          setNewMemberMessage(
              "Unable to create nutrition goals."
          );
          return;
      }

      const addedUser = newMembers.find(
          (member) =>
              member.user_id === newMemberUserId
      );

      // Add the newly created member to the existing member list
      setMembers((previousMembers) => [
          ...previousMembers,
          {
              ...data,
              displayName:
                  addedUser?.displayName ||
                  "Unknown User"
          }
      ]);

      // Remove them from the "new member" dropdown
      const remainingNewMembers =
          newMembers.filter(
              (member) =>
                  member.user_id !==
                  newMemberUserId
          );

      setNewMembers(remainingNewMembers);

      setNewMemberUserId(
          remainingNewMembers.length > 0
              ? remainingNewMembers[0].user_id
              : ""
      );

      setNewGoals({
          calorie_goal: "",
          protein_goal: "",
          carbs_goal: "",
          fat_goal: "",
          weight_goal: "",
          step_goal: "",
          water_goal: ""
      });

      setNewMemberMessage(
          `Created nutrition goals for ${
              addedUser?.displayName ||
              "the selected user"
          }.`
      );
  };

  return (
    <div className="adminMembersPage">
      <div className="membersHeaderRow">
        <div>
          <p className="membersEyebrow">Members</p>
          <h1 className="membersTitle">Update Member&apos;s Data</h1>
          <p className="membersSubtitle">
            Pick a member, choose the field to update, enter the new value, and save.
          </p>
        </div>

        <div className="membersDatePill">📆 {currentDate}</div>
      </div>

      <section className="membersWorkspace">
        <aside className="memberPreviewCard">
          <p className="previewLabel">Current Preview</p>
          <h2>{selectedMember?.displayName || "No member selected"}</h2>
          <div className="previewList">
            <div className="previewColumn">
              {editableFields.slice(0, 6).map((field) => (
                <div className="previewRow" key={field.value}>
                  <span>{field.label}</span>
                  <strong>{memberData[field.value]}</strong>
                </div>
              ))}
            </div>
            <div className="previewColumn">
              {editableFields.slice(6).map((field) => (
                <div className="previewRow" key={field.value}>
                  <span>{field.label}</span>
                  <strong>{memberData[field.value]}</strong>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <form className="memberUpdateForm" onSubmit={handleSave}>
          <div className="formRow">
            <label htmlFor="memberName">Member</label>
            <select
                id="memberName"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
            >
                {members.map((member) => (
                    <option
                        key={member.user_id}
                        value={member.user_id}
                    >
                        {member.displayName}
                    </option>
                ))}
            </select>
          </div>

          <div className="formRow">
            <label htmlFor="fieldName">Field to Update</label>
            <select
              id="fieldName"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
            >
              {editableFields
                  .filter((field) => !hardcodedFields.includes(field.value))
                  .map((field) => (
                      <option key={field.value} value={field.value}>
                          {field.label}
                      </option>
                  ))
              }
            </select>
          </div>

          <div className="formRow">
            <label htmlFor="newValue">New Data</label>
            <input
                id="newValue"
                type="number"
                min="0"
                step="1"
                placeholder={`Enter new ${selectedFieldLabel.toLowerCase()}`}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
            />
          </div>

          <button type="submit" className="saveMemberButton">
            Save
          </button>

          {savedMessage && <p className="savedMessage">{savedMessage}</p>}
        </form>

        <form
            className="memberUpdateForm"
            onSubmit={handleCreateMemberGoals}
        >
            <div className="newMemberHeader">
                <p className="previewLabel">
                    New Member
                </p>

                <h2>
                    Add New Member Goals
                </h2>

                <p className="newMemberSubtitle">
                    Add nutrition goals for a registered user
                    who does not currently have a goals record.
                </p>
            </div>

            <div className="formRow">
                <label htmlFor="newMember">
                    Member
                </label>

                <select
                    id="newMember"
                    value={newMemberUserId}
                    onChange={(e) =>
                        setNewMemberUserId(e.target.value)
                    }
                    disabled={newMembers.length === 0}
                >
                    {newMembers.length === 0 ? (
                        <option value="">
                            All users already have nutrition goals
                        </option>
                    ) : (
                        newMembers.map((member) => (
                            <option
                                key={member.user_id}
                                value={member.user_id}
                            >
                                {member.displayName}
                            </option>
                        ))
                    )}
                </select>
            </div>

            <div className="formRow">
                <label>Calories Target (kcal)</label>
                <input
                    type="number"
                    min="0"
                    step="1"
                    value={newGoals.calorie_goal}
                    onChange={(e) =>
                        handleNewGoalChange(
                            "calorie_goal",
                            e.target.value
                        )
                    }
                />
            </div>

            <div className="formRow">
                <label>Weight Target (kg)</label>
                <input
                    type="number"
                    min="0"
                    step="1"
                    value={newGoals.weight_goal}
                    onChange={(e) =>
                        handleNewGoalChange(
                            "weight_goal",
                            e.target.value
                        )
                    }
                />
            </div>

            <div className="formRow">
                <label>Steps Target</label>
                <input
                    type="number"
                    min="0"
                    step="1"
                    value={newGoals.step_goal}
                    onChange={(e) =>
                        handleNewGoalChange(
                            "step_goal",
                            e.target.value
                        )
                    }
                />
            </div>

            <div className="formRow">
                <label>Protein Target (g)</label>
                <input
                    type="number"
                    min="0"
                    step="1"
                    value={newGoals.protein_goal}
                    onChange={(e) =>
                        handleNewGoalChange(
                            "protein_goal",
                            e.target.value
                        )
                    }
                />
            </div>

            <div className="formRow">
                <label>Carbohydrates Target (g)</label>
                <input
                    type="number"
                    min="0"
                    step="1"
                    value={newGoals.carbs_goal}
                    onChange={(e) =>
                        handleNewGoalChange(
                            "carbs_goal",
                            e.target.value
                        )
                    }
                />
            </div>

            <div className="formRow">
                <label>Fat Target (g)</label>
                <input
                    type="number"
                    min="0"
                    step="1"
                    value={newGoals.fat_goal}
                    onChange={(e) =>
                        handleNewGoalChange(
                            "fat_goal",
                            e.target.value
                        )
                    }
                />
            </div>

            <div className="formRow">
                <label>Water Target (L)</label>
                <input
                    type="number"
                    min="0"
                    step="1"
                    value={newGoals.water_goal}
                    onChange={(e) =>
                        handleNewGoalChange(
                            "water_goal",
                            e.target.value
                        )
                    }
                />
            </div>

            <button
                type="submit"
                className="saveMemberButton"
                disabled={newMembers.length === 0}
            >
                Add Member
            </button>

            {newMemberMessage && (
                <p className="savedMessage">
                    {newMemberMessage}
                </p>
            )}
        </form>
      </section>
    </div>
  );
}
