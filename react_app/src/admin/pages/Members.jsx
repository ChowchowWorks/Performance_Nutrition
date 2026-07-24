import { useMemo, useState } from 'react';
import '../admin.css';
import './Members.css';

const dummyMembers = [
  'Clarence Chow',
  'Alicia Tan',
  'Benjamin Lim',
  'Sophie Ng',
  'Daniel Wong',
];

const editableFields = [
  { value: 'membershipTier', label: 'Membership Tier' },
  { value: 'goalWeight', label: 'Goal Weight' },
  { value: 'assignedCoach', label: 'Assigned Coach' },
  { value: 'renewalDate', label: 'Renewal Date' },
  { value: 'status', label: 'Status' },
];

const seedMemberData = {
  membershipTier: 'Gold',
  goalWeight: '68 kg',
  assignedCoach: 'Coach Amelia',
  renewalDate: '15 Aug 2026',
  status: 'Active',
};

export default function Members() {
  const [memberName, setMemberName] = useState(dummyMembers[0]);
  const [fieldName, setFieldName] = useState(editableFields[0].value);
  const [newValue, setNewValue] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const [memberData, setMemberData] = useState(seedMemberData);

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, []);

  const selectedFieldLabel = editableFields.find((field) => field.value === fieldName)?.label || '';

  const handleSave = (event) => {
    event.preventDefault();

    if (!memberName || !fieldName || !newValue.trim()) {
      setSavedMessage('Please select a member, field, and new value before saving.');
      return;
    }

    setMemberData((prev) => ({
      ...prev,
      [fieldName]: newValue.trim(),
    }));

    setSavedMessage(`Saved ${selectedFieldLabel} for ${memberName}.`);
    setNewValue('');
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
        <form className="memberUpdateForm" onSubmit={handleSave}>
          <div className="formRow">
            <label htmlFor="memberName">Member&apos;s Name</label>
            <select
              id="memberName"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
            >
              {dummyMembers.map((member) => (
                <option key={member} value={member}>
                  {member}
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
              {editableFields.map((field) => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>
          </div>

          <div className="formRow">
            <label htmlFor="newValue">New Data</label>
            <input
              id="newValue"
              type="text"
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

        <aside className="memberPreviewCard">
          <p className="previewLabel">Current Preview</p>
          <h2>{memberName}</h2>
          <div className="previewList">
            {editableFields.map((field) => (
              <div className="previewRow" key={field.value}>
                <span>{field.label}</span>
                <strong>{memberData[field.value]}</strong>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
