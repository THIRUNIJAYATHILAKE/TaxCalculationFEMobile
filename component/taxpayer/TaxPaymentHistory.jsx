import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const TaxPaymentHistory = () => {
    const [data, setData] = useState([]); // State to hold the retrieved data from the API
    const [date, setDate] = useState(null); // State for the selected date
    const [selectedValue2, setSelectedValue2] = useState("All transactions"); // State for the selected description value
    const [showDatePicker, setShowDatePicker] = useState(false); // State for showing the date picker

    // Fetch data from the API URL when the component mounts
    useEffect(() => {
        fetch("http://localhost:3000/api/taxpayer/taxHistoryType/1")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    // Function to handle date input change
    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(new Date(selectedDate));
        }
    };

    // Memoized filtered data based on date and description
    const filteredData = React.useMemo(() => {
        return data.filter((d) => {
            const selectedDate = date ? date.toISOString().split("T")[0] : null;
            const dateMatch = !date || d.date === selectedDate;
            const descriptionMatch = selectedValue2 === "All transactions" || d.description.includes(selectedValue2);
            return dateMatch && descriptionMatch;
        });
    }, [data, date, selectedValue2]);

    // Function to generate a PDF report
    const generatePDF = async () => {
        const htmlContent = `
            <html>
                <head>
                    <style>
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid black; padding: 8px; text-align: center; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h1>Paid Tax Summary Report</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Description</th>
                                <th>Reference</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredData.map(d => `
                                <tr key=${d.taxHistoryId}>
                                    <td>${d.date}</td>
                                    <td>${d.time}</td>
                                    <td>${d.description}</td>
                                    <td>${d.reference}</td>
                                    <td>${d.amount}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;

        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        await shareAsync(uri);
    };

    return (
        <View style={styles.container}>
            <View style={styles.dropdownContainer}>
                <Picker
                    selectedValue={selectedValue2}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedValue2(itemValue)}
                >
                    <Picker.Item label="All transactions" value="All transactions" />
                    <Picker.Item label="Employment income" value="Employment income" />
                    <Picker.Item label="Investment income" value="Investment income" />
                    <Picker.Item label="Business income" value="Business income" />
                    <Picker.Item label="Other income" value="Other income" />
                </Picker>
            </View>

            <View style={styles.datePickerContainer}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <TextInput
                        style={styles.dateInput}
                        placeholder="Select Date"
                        value={date ? date.toISOString().split('T')[0] : ''}
                        editable={false}
                    />
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date || new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.taxHistoryId.toString()}
                renderItem={({ item }) => (
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>{item.date}</Text>
                        <Text style={styles.tableCell}>{item.time}</Text>
                        <Text style={styles.tableCell}>{item.description}</Text>
                        <Text style={styles.tableCell}>{item.reference}</Text>
                        <Text style={styles.tableCell}>{item.amount}</Text>
                    </View>
                )}
                ListHeaderComponent={() => (
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderCell}>Date</Text>
                        <Text style={styles.tableHeaderCell}>Time</Text>
                        <Text style={styles.tableHeaderCell}>Description</Text>
                        <Text style={styles.tableHeaderCell}>Reference</Text>
                        <Text style={styles.tableHeaderCell}>Amount</Text>
                    </View>
                )}
            />

            <View style={styles.buttonContainer}>
                <Button title="Generate Paid Tax Summary Report" onPress={generatePDF} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    dropdownContainer: {
        marginBottom: 16,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    datePickerContainer: {
        marginBottom: 16,
    },
    dateInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        paddingVertical: 8,
    },
    tableHeaderCell: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: 16,
    },
});

export default TaxPaymentHistory;
