import { useEffect, useMemo, useState } from 'react';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import '../admin.css';
import './Events.css';

const eventDifficultyOptions = ['Beginner', 'Intermediate', 'Advanced'];

const initialForm = {
  eventName: '',
  eventDate: '',
  eventDuration: '',
  eventLocation: '',
  difficulty: eventDifficultyOptions[0],
  totalVacancy: '',
  googleFormLink: '',
  thumbnailLink: '',
};

const formatDuration = (duration) => {
  if (!duration && duration !== 0) return 'Not set';

  if (duration >= 60) {
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;

    if (mins === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }

    return `${hours} hour${hours > 1 ? 's' : ''} ${mins} mins`;
  }

  return `${duration} mins`;
};

const formatEventDate = (eventDate) => {
  if (!eventDate) return 'Not set';

  const dateValue = eventDate?.toDate ? eventDate.toDate() : new Date(eventDate);

  return dateValue.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    weekday: 'long',
  });
};

const formatEventDateForInput = (eventDate) => {
  if (!eventDate) return '';

  const dateValue = eventDate?.toDate ? eventDate.toDate() : new Date(eventDate);
  return dateValue.toISOString().split('T')[0];
};

const mapEventToFormData = (event) => ({
  eventName: event.eventName ?? '',
  eventDate: formatEventDateForInput(event.eventDate),
  eventDuration: event.duration !== undefined && event.duration !== null ? String(event.duration) : '',
  eventLocation: event.location ?? '',
  difficulty: event.difficulty || eventDifficultyOptions[0],
  totalVacancy: event.spaces !== undefined && event.spaces !== null ? String(event.spaces) : '',
  googleFormLink: event.googleFormLink ?? '',
  thumbnailLink: event.link ?? '',
});

const buildEventPayload = (eventData) => ({
  eventName: eventData.eventName.trim(),
  eventDate: Timestamp.fromDate(new Date(`${eventData.eventDate}T00:00:00`)),
  duration: Number(eventData.eventDuration),
  location: eventData.eventLocation.trim(),
  difficulty: eventData.difficulty,
  spaces: Number(eventData.totalVacancy),
  googleFormLink: eventData.googleFormLink.trim(),
  link: eventData.thumbnailLink.trim(),
});

export default function AdminEvents() {
  const [activeTab, setActiveTab] = useState('current');
  const [formData, setFormData] = useState(initialForm);
  const [editingFormData, setEditingFormData] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [savedMessage, setSavedMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [events, setEvents] = useState([]);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [editModeEnabled, setEditModeEnabled] = useState(false);

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, []);

  const pageTitle = activeTab === 'current' ? 'Current Events' : 'Create New Event';
  const pageSubtitle =
    activeTab === 'current'
      ? 'Review the live event list, open the Google Form link, and inspect each event row.'
      : 'Fill in the details below to publish an event card to the member portal.';

  useEffect(() => {
    const getEvents = async () => {
      try {
        const coll = collection(db, 'events');
        const collSnap = await getDocs(coll);

        const fetchedEvents = collSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        fetchedEvents.sort((a, b) => {
          const aDate = a.eventDate?.toDate ? a.eventDate.toDate().getTime() : new Date(a.eventDate).getTime();
          const bDate = b.eventDate?.toDate ? b.eventDate.toDate().getTime() : new Date(b.eventDate).getTime();

          return aDate - bDate;
        });

        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    if (activeTab === 'current') {
      getEvents();
    }
  }, [activeTab]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditModeToggle = () => {
    setEditModeEnabled((prev) => {
      const nextValue = !prev;

      if (!nextValue) {
        setExpandedEventId(null);
        setEditingFormData(null);
        setEditingEventId(null);
      }

      return nextValue;
    });
  };

  const handleEditFieldChange = (event) => {
    const { name, value } = event.target;

    setEditingFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartEditEvent = (event) => {
    setEditModeEnabled(true);
    setExpandedEventId(event.id);
    setEditingEventId(event.id);
    setEditingFormData(mapEventToFormData(event));
  };

  const handleCancelEditEvent = () => {
    setEditingFormData(null);
    setEditingEventId(null);
  };

  const refreshEvents = async () => {
    const coll = collection(db, 'events');
    const collSnap = await getDocs(coll);

    const fetchedEvents = collSnap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    fetchedEvents.sort((a, b) => {
      const aDate = a.eventDate?.toDate ? a.eventDate.toDate().getTime() : new Date(a.eventDate).getTime();
      const bDate = b.eventDate?.toDate ? b.eventDate.toDate().getTime() : new Date(b.eventDate).getTime();

      return aDate - bDate;
    });

    setEvents(fetchedEvents);
  };

  const handleSaveEditEvent = async (event) => {
    event.preventDefault();

    if (!editingFormData || !editingEventId) return;

    setSavedMessage('');

    const requiredFields = [
      editingFormData.eventName,
      editingFormData.eventDate,
      editingFormData.eventDuration,
      editingFormData.eventLocation,
      editingFormData.difficulty,
      editingFormData.totalVacancy,
      editingFormData.googleFormLink,
      editingFormData.thumbnailLink,
    ];

    if (requiredFields.some((field) => !String(field).trim())) {
      setSavedMessage('Please complete all fields before saving the event.');
      return;
    }

    setIsSaving(true);

    try {
      await updateDoc(doc(db, 'events', editingEventId), buildEventPayload(editingFormData));
      await refreshEvents();
      setSavedMessage('Event updated successfully.');
      setEditingFormData(null);
      setEditingEventId(null);
    } catch (error) {
      console.error('Error updating event:', error);
      setSavedMessage('Unable to update the event. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = async (event) => {
    const confirmed = window.confirm(`Delete "${event.eventName}"? This cannot be undone.`);

    if (!confirmed) return;

    setSavedMessage('');

    try {
      await deleteDoc(doc(db, 'events', event.id));
      await refreshEvents();

      if (expandedEventId === event.id) {
        setExpandedEventId(null);
      }

      if (editingEventId === event.id) {
        setEditingFormData(null);
        setEditingEventId(null);
      }

      setSavedMessage('Event deleted successfully.');
    } catch (error) {
      console.error('Error deleting event:', error);
      setSavedMessage('Unable to delete the event. Please try again.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSavedMessage('');

    const requiredFields = [
      formData.eventName,
      formData.eventDate,
      formData.eventDuration,
      formData.eventLocation,
      formData.difficulty,
      formData.totalVacancy,
      formData.googleFormLink,
      formData.thumbnailLink,
    ];

    if (requiredFields.some((field) => !field.trim())) {
      setSavedMessage('Please complete all fields before saving the event.');
      return;
    }

    setIsSaving(true);

    try {
      await addDoc(collection(db, 'events'), {
        eventName: formData.eventName.trim(),
        eventDate: Timestamp.fromDate(new Date(`${formData.eventDate}T00:00:00`)),
        duration: Number(formData.eventDuration),
        location: formData.eventLocation.trim(),
        difficulty: formData.difficulty,
        spaces: Number(formData.totalVacancy),
        googleFormLink: formData.googleFormLink.trim(),
        link: formData.thumbnailLink.trim(),
      });

      setSavedMessage('Event saved successfully and added to the member Events page.');
      setFormData(initialForm);
    } catch (error) {
      console.error('Error saving event:', error);
      setSavedMessage('Unable to save the event. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="adminEventsPage">
      <div className="eventsHeaderRow">
        <div>
          <p className="eventsEyebrow">Update Events</p>
          <h1 className="eventsTitle">{pageTitle}</h1>
          <p className="eventsSubtitle">{pageSubtitle}</p>
        </div>

        <div className="eventsDatePill">📆 {currentDate}</div>
      </div>

      <section className="eventsTabs">
        <button
          type="button"
          className={activeTab === 'current' ? 'eventsTab active' : 'eventsTab'}
          onClick={() => setActiveTab('current')}
        >
          Current Events
        </button>
        <button
          type="button"
          className={activeTab === 'create' ? 'eventsTab active' : 'eventsTab'}
          onClick={() => setActiveTab('create')}
        >
          Create New Event
        </button>
      </section>

      {activeTab === 'create' && (
        <section className="eventsWorkspace">
          <form className="eventCreateForm" onSubmit={handleSubmit}>
            <div className="formRow">
              <label htmlFor="eventName">Event Name</label>
              <input
                id="eventName"
                name="eventName"
                type="text"
                value={formData.eventName}
                onChange={handleChange}
                placeholder="Enter the event name"
              />
            </div>

            <div className="formRowGrid">
              <div className="formRow">
                <label htmlFor="eventDate">Event Date</label>
                <input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={handleChange}
                />
              </div>

              <div className="formRow">
                <label htmlFor="eventDuration">Event Duration</label>
                <input
                  id="eventDuration"
                  name="eventDuration"
                  type="number"
                  min="1"
                  placeholder="Duration in minutes"
                  value={formData.eventDuration}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="formRowGrid">
              <div className="formRow">
                <label htmlFor="eventLocation">Event Location</label>
                <input
                  id="eventLocation"
                  name="eventLocation"
                  type="text"
                  value={formData.eventLocation}
                  onChange={handleChange}
                  placeholder="Venue or location"
                />
              </div>

              <div className="formRow">
                <label htmlFor="difficulty">Difficulty</label>
                <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange}>
                  {eventDifficultyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="formRowGrid">
              <div className="formRow">
                <label htmlFor="totalVacancy">Total Vacancy</label>
                <input
                  id="totalVacancy"
                  name="totalVacancy"
                  type="number"
                  min="1"
                  placeholder="Number of slots"
                  value={formData.totalVacancy}
                  onChange={handleChange}
                />
              </div>

              <div className="formRow">
                <label htmlFor="googleFormLink">Google Form Link</label>
                <input
                  id="googleFormLink"
                  name="googleFormLink"
                  type="url"
                  value={formData.googleFormLink}
                  onChange={handleChange}
                  placeholder="Paste Google Form link"
                />
              </div>
            </div>

            <div className="formRow">
              <label htmlFor="thumbnailLink">Thumbnail Photo Link</label>
              <input
                id="thumbnailLink"
                name="thumbnailLink"
                type="url"
                value={formData.thumbnailLink}
                onChange={handleChange}
                placeholder="Paste image URL for the event thumbnail"
              />
            </div>

            <button type="submit" className="saveEventButton" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Event'}
            </button>

            {savedMessage && <p className="savedMessage">{savedMessage}</p>}
          </form>

          <aside className="eventPreviewCard">
            <p className="previewLabel">Preview</p>
            <h2>{formData.eventName || 'Event Title Preview'}</h2>
            <div className="eventThumbnailPreview">
              {formData.thumbnailLink ? (
                <img src={formData.thumbnailLink} alt="Event thumbnail preview" />
              ) : (
                <div className="thumbnailFallback">Thumbnail preview appears here</div>
              )}
            </div>
            <div className="previewList">
              <div className="previewRow">
                <span>Date</span>
                <strong>{formData.eventDate || 'Not selected'}</strong>
              </div>
              <div className="previewRow">
                <span>Duration</span>
                <strong>{formData.eventDuration ? `${formData.eventDuration} mins` : 'Not set'}</strong>
              </div>
              <div className="previewRow">
                <span>Location</span>
                <strong>{formData.eventLocation || 'Not set'}</strong>
              </div>
              <div className="previewRow">
                <span>Difficulty</span>
                <strong>{formData.difficulty}</strong>
              </div>
              <div className="previewRow">
                <span>Total Vacancy</span>
                <strong>{formData.totalVacancy || 'Not set'}</strong>
              </div>
            </div>
          </aside>
        </section>
      )}

      {activeTab === 'current' && (
        <section className="currentEventsWorkspace">
          <div className="currentEventsToolbar">
            <button type="button" className={editModeEnabled ? 'editEventsButton active' : 'editEventsButton'} onClick={handleEditModeToggle}>
              Edit Events
            </button>
            {editModeEnabled && <p className="editEventsHint">Select an event to reveal Edit Event and Delete Event actions.</p>}
          </div>

          <div className="currentEventsList">
            {events.length === 0 ? (
              <div className="emptyEventsState">
                No events have been saved yet.
              </div>
            ) : (
              events.map((event) => {
                const isOpen = expandedEventId === event.id;

                return (
                  <div className="currentEventItem" key={event.id}>
                    <button
                      type="button"
                      className="currentEventToggle"
                      onClick={() => {
                        setExpandedEventId(isOpen ? null : event.id);
                        if (editingEventId === event.id && isOpen) {
                          setEditingFormData(null);
                          setEditingEventId(null);
                        }
                      }}
                    >
                      <span>{event.eventName}</span>
                      <span className="toggleCaret">{isOpen ? '▾' : '▸'}</span>
                    </button>

                    {editModeEnabled && (
                      <div className="currentEventActions">
                        <button
                          type="button"
                          className="currentEventActionButton"
                          onClick={() => handleStartEditEvent(event)}
                        >
                          Edit Event
                        </button>
                        <button
                          type="button"
                          className="currentEventActionButton danger"
                          onClick={() => handleDeleteEvent(event)}
                        >
                          Delete Event
                        </button>
                      </div>
                    )}

                    {isOpen && (
                      <div className="currentEventDetails">
                        {editingEventId === event.id && editingFormData ? (
                          <form className="currentEventEditForm" onSubmit={handleSaveEditEvent}>
                            <div className="eventDetailsGrid editGrid">
                              <div className="detailRow">
                                <label htmlFor={`edit-eventName-${event.id}`}>Event Name</label>
                                <input
                                  id={`edit-eventName-${event.id}`}
                                  name="eventName"
                                  type="text"
                                  value={editingFormData.eventName}
                                  onChange={handleEditFieldChange}
                                />
                              </div>
                              <div className="detailRow">
                                <label htmlFor={`edit-eventDate-${event.id}`}>Event Date</label>
                                <input
                                  id={`edit-eventDate-${event.id}`}
                                  name="eventDate"
                                  type="date"
                                  value={editingFormData.eventDate}
                                  onChange={handleEditFieldChange}
                                />
                              </div>
                              <div className="detailRow">
                                <label htmlFor={`edit-eventDuration-${event.id}`}>Event Duration</label>
                                <input
                                  id={`edit-eventDuration-${event.id}`}
                                  name="eventDuration"
                                  type="number"
                                  min="1"
                                  value={editingFormData.eventDuration}
                                  onChange={handleEditFieldChange}
                                />
                              </div>
                              <div className="detailRow">
                                <label htmlFor={`edit-eventLocation-${event.id}`}>Event Location</label>
                                <input
                                  id={`edit-eventLocation-${event.id}`}
                                  name="eventLocation"
                                  type="text"
                                  value={editingFormData.eventLocation}
                                  onChange={handleEditFieldChange}
                                />
                              </div>
                              <div className="detailRow">
                                <label htmlFor={`edit-difficulty-${event.id}`}>Difficulty</label>
                                <select
                                  id={`edit-difficulty-${event.id}`}
                                  name="difficulty"
                                  value={editingFormData.difficulty}
                                  onChange={handleEditFieldChange}
                                >
                                  {eventDifficultyOptions.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="detailRow">
                                <label htmlFor={`edit-totalVacancy-${event.id}`}>Total Vacancy</label>
                                <input
                                  id={`edit-totalVacancy-${event.id}`}
                                  name="totalVacancy"
                                  type="number"
                                  min="1"
                                  value={editingFormData.totalVacancy}
                                  onChange={handleEditFieldChange}
                                />
                              </div>
                              <div className="detailRow linkRow">
                                <label htmlFor={`edit-googleFormLink-${event.id}`}>Google Form Link</label>
                                <input
                                  id={`edit-googleFormLink-${event.id}`}
                                  name="googleFormLink"
                                  type="url"
                                  value={editingFormData.googleFormLink}
                                  onChange={handleEditFieldChange}
                                />
                              </div>
                              <div className="detailRow linkRow">
                                <label htmlFor={`edit-thumbnailLink-${event.id}`}>Thumbnail Photo Link</label>
                                <input
                                  id={`edit-thumbnailLink-${event.id}`}
                                  name="thumbnailLink"
                                  type="url"
                                  value={editingFormData.thumbnailLink}
                                  onChange={handleEditFieldChange}
                                />
                              </div>
                            </div>

                            <div className="currentEventEditActions">
                              <button type="submit" className="saveEventButton" disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Changes'}
                              </button>
                              <button type="button" className="currentEventActionButton secondary" onClick={handleCancelEditEvent}>
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div className="eventThumbMini">
                              {event.link ? (
                                <img src={event.link} alt={event.eventName} />
                              ) : (
                                <div className="thumbnailFallback">No thumbnail available</div>
                              )}
                            </div>

                            <div className="eventDetailsGrid">
                              <div className="detailRow">
                                <span>Event Date</span>
                                <strong>{formatEventDate(event.eventDate)}</strong>
                              </div>
                              <div className="detailRow">
                                <span>Event Duration</span>
                                <strong>{formatDuration(event.duration)}</strong>
                              </div>
                              <div className="detailRow">
                                <span>Event Location</span>
                                <strong>{event.location || 'Not set'}</strong>
                              </div>
                              <div className="detailRow">
                                <span>Difficulty</span>
                                <strong>{event.difficulty || 'Not set'}</strong>
                              </div>
                              <div className="detailRow">
                                <span>Total Vacancy</span>
                                <strong>{event.spaces ?? 'Not set'}</strong>
                              </div>
                              <div className="detailRow linkRow">
                                <span>Google Form Link</span>
                                {event.googleFormLink ? (
                                  <a href={event.googleFormLink} target="_blank" rel="noreferrer">
                                    Open Google Form
                                  </a>
                                ) : (
                                  <strong>Not set</strong>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                        </div>
                      )}
                    </div>
                );
              })
            )}
          </div>
        </section>
      )}
    </div>
  );
}
