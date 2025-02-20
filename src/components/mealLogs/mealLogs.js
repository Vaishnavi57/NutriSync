import { useContext, useEffect, useState } from 'react';
import { RiDeleteBin6Line, RiEdit2Line } from 'react-icons/ri';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import DateTimePicker from 'react-datetime-picker';
import axios from 'axios';
import moment from 'moment';
import AuthContext from '../../context/authContext';
import styles from './MealLogs.module.css';

const MealLogs = () => {
    const { token, userId } = useContext(AuthContext);
    const currDate = moment();

    const [entries, setEntries] = useState([]);
    const [descInput, setDescInput] = useState('');
    const [noteInput, setNoteInput] = useState('');
    const [timeInput, setTimeInput] = useState(currDate.format('HH:mm'));
    const [dateInput, setDateInput] = useState(currDate.format('YYYY-MM-DD'));
    const [isShown, setIsShown] = useState(false);
    const [displayModal, setDisplayModal] = useState(false);
    const [currEditId, setCurrEditId] = useState(null);

    const formattedTime = (date, time) => {
        return moment(`${date} ${time}`).format('ddd M-D-YY H:m A');
    };

    useEffect(() => {
        axios.get(`http://localhost:4040/entries`, {
            headers: {
                'x-auth-token': token
            }
        })
            .then(res => {
                setEntries(res.data);
            })
            .catch(err => console.log(err));
    }, [token]);

    const handleSubmit = (event) => {
        // TODO: determine whether to use controlled or uncontrolled form logic
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const values = Object.fromEntries(data.entries());

        axios.post('http://localhost:4040/entries', values, {
            headers: {
                'x-auth-token': token
            }
        })
            .then(res => {
                setIsShown(false);
                setEntries([...entries, res.data]);
                setDescInput('');
                setNoteInput('');
            })
            .catch(err => console.log(err));
    }

    const handleToggle = () => {
        setIsShown(() => !isShown);
    }

    const handleEdit = (entryDetails) => {

        setDescInput(entryDetails.description);
        setNoteInput(entryDetails.notes);
        setDateInput(entryDetails.date);
        setTimeInput(entryDetails.time);
        setCurrEditId(entryDetails.id);
        setDisplayModal(true);
    }

    const handleUpdate = (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const values = Object.fromEntries(data.entries());

        axios.put(`http://localhost:4040/entries/${currEditId}`, values, {
            headers: {
                'x-auth-token': token
            }
        })
            .then(res => {

            })
            .catch(err => console.log(err));
        setDisplayModal(false);
    }

    const handleDelete = (entryId) => {
        axios.delete(`http://localhost:4040/entries/${entryId}`, {
            headers: {
                'x-auth-token': token
            }
        })
            .then(res => {
                const updatedEntries = entries.filter(e => e.id !== entryId);
                setEntries(updatedEntries);
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="content">
            <h1 className={styles.logTitle}>
                {currDate.format('[Today - ] MMM Do')}
            </h1>
            <button className={styles.entryFormToggle} onClick={handleToggle} >{isShown ? 'Close' : 'Add Meal'}</button>
            {isShown && <form className={styles.mealForm} onSubmit={handleSubmit}>
                <label>What's on the menu?
                    <br></br><input type="text" name="description" value={descInput} onChange={e => setDescInput(e.target.value)} />
                </label>
                <input type="date" name="date" value={dateInput} onChange={e => setDateInput(e.target.value)}></input>
                <input type="time" name="time" value={timeInput} onChange={e => setTimeInput(e.target.value)}></input>
                <label>Notes</label>
                <textarea type="text" name="notes" value={noteInput} onChange={e => setNoteInput(e.target.value)} />
                <button type="Submit" >Submit</button>
            </form>}
            <div className={styles.entryContainer}>
                {!entries.length ? 'No entries yet.' :
                    entries.map(entry => {
                        return <div className={styles.entry} key={entry.id}>
                            <p>{entry.description}</p>
                            <p className={styles.notes}>{entry.notes}</p>
                            <p className={styles.timestamp}>{formattedTime(entry.date, entry.time)}</p>
                            <button onClick={() => handleEdit(entry)}><RiEdit2Line /></button>
                            <button onClick={() => handleDelete(entry.id)}><RiDeleteBin6Line /></button>
                        </div>
                    })}
            </div>
            {displayModal && <div className={styles.editModal}>
                <form className={styles.editForm} onSubmit={handleUpdate}>
                    <input type="text" name="description" value={descInput} onChange={e => setDescInput(e.target.value)} />
                    <input type="date" name="date" value={dateInput} onChange={e => setDateInput(e.target.value)}></input>
                    <input type="time" name="time" value={timeInput} onChange={e => setTimeInput(e.target.value)}></input>
                    <label>Notes</label>
                    <textarea type="text" name="notes" value={noteInput} onChange={e => setNoteInput(e.target.value)} />
                    <button type="Submit" >Done</button>
                </form>
            </div>}
        </div>

    );
}

export default MealLogs;