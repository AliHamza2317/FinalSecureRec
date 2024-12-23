import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { utils, writeFile } from 'xlsx';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import dashboardIcon from "./assets/icons8-dashboard-24.png";
import UploadIcon from './assets/icons8-upload-80.png';
import { jwtDecode } from 'jwt-decode';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

const drawerWidth = 240;

const UploadBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: '3px dashed black',
  borderRadius: '8px',
  padding: '20px 10px',
  marginTop: '20px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
  width: '100%',
}));

const AlertBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: '#4caf50',
  color: '#ffffff',
  padding: '8px 16px',
  borderRadius: '4px',
  textAlign: 'center',
  fontSize: '0.75rem',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  marginBottom: '16px',
}));

const Button = styled('button')(({ theme }) => ({
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
  '&:hover': {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)',
  },
  '&:disabled': {
    backgroundColor: '#b0bec5',
    cursor: 'not-allowed',
  },
}));

const Premium = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);

      const userId = decodedToken.userId;

      const fetchUserData = async () => {
        try {
          const response = await fetch(`https://secure-rec-backend.vercel.app/users/users/${userId}`, {
            headers: {
              'x-access-token': token, // or 'Authorization': `Bearer ${token}`
            },
          });
          const data = await response.json();
          console.log("Fetched User Data:", data);

          if (response.ok) {
            setUser(data); // Update this line
          } else {
            console.error("Failed to fetch user details");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUserData();
    }
  }, []);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [chartData, setChartData] = useState({});

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadStatus(`Selected File: ${event.target.files[0].name}`);
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
      setUploadStatus(`Selected File: ${event.dataTransfer.files[0].name}`);
    }
  };

  const handleFileDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleIconClick = () => {
    document.getElementById('file-upload').click();
  };

  const handleUpload = () => {
    if (selectedFile) {
      setIsAnalyzing(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      axios.post('https://1bc6-34-173-224-192.ngrok-free.app/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 900000,
      })
        .then((response) => {
          console.log(response.data);
          setResults(response.data);
          setUploadStatus(`File "${selectedFile.name}" uploaded and analyzed successfully!`);
          processChartData(response.data);
        })
        .catch((error) => {
          console.error('Error:', error);
          setUploadStatus('Error during file upload and analysis');
        })
        .finally(() => {
          setIsAnalyzing(false);
        });
    } else {
      setUploadStatus('No file selected');
    }
  };

  const handleDownloadExcel = () => {
    if (results && Array.isArray(results)) {
      const allowedPatterns = [
        'Informative Dialogues', 'User-Friendly Error Messages', 'Conveying Threats & Consequences',
        'Human-Computer Interaction for Security (HCI-S)', 'Warn When Unsafe', 'Recoverable Errors',
        'Disclose Significant Deviations', 'Security Indicators', 'Direct Access to UI Components',
        'Minimize User Inconvenience', 'Progressive Disclosure', 'Interactive Feedback',
        'User-Friendly Security Policies', 'Contextual Help and Support', 'Attractive Options',
        'User Consent for Actions', 'Visual and Auditory Notifications', 'System Defaults to Secure Settings',
        'Encryption and Decryption Options', 'Access Control Management', 'Secure Development Practices',
        'Security Testing and Evaluation', 'Authorization', 'Incident Response Plans', 'Regular Security Updates',
        'General Notifications About Security', 'Email-Based Identification and Authentication',
        'Multi-Factor Authentication (MFA)', 'Create a Security Lexicon', 'Audit and Log User Actions',
        'Risk Assessment Tools', 'Migrate and Backup Keys', 'Security Features Used by the User',
        'Security Features Used by the System'
      ];

      const data = results.map((review) => {
        let recommendations = [];
        if (Array.isArray(review['Hybrid_Recommendations'])) {
          recommendations = review['Hybrid_Recommendations'].filter(item =>
            allowedPatterns.includes(item)
          );
        }
        return {
          "App Review": review['Apps Reviews'],
          "Identified Issue": review['Identify issue'],
          "Subcategory": review['Subcategory'],
          "Sentiment_Result": review['Sentiment_Result'],
          "Hybrid_Recommendations": recommendations.length > 0 
            ? recommendations.join(", ") 
            : 'None'
        };
      });

      const ws = utils.json_to_sheet(data);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Reviews");

      writeFile(wb, "reviews_analysis.xlsx");
    }
  };

  const processChartData = (data) => {
    const chartData = {};
    chartData.totalReviews = data.length;

    const sentiments = data.map(review => review['Sentiment_Result'].toLowerCase());
    chartData.positiveReviews = sentiments.filter(sentiment => sentiment.includes('pos')).length;
    chartData.negativeReviews = sentiments.filter(sentiment => sentiment.includes('neg')).length;
  
    const identifiedIssues = {};
    data.forEach(review => {
      const issue = review['Identify issue'];
      if (!identifiedIssues[issue]) {
        identifiedIssues[issue] = 0;
      }
      identifiedIssues[issue]++;
    });
    chartData.identifiedIssues = Object.keys(identifiedIssues).map(issue => ({ name: issue, value: identifiedIssues[issue] }));
  
    const subcategories = {};
    data.forEach(review => {
      const subcategory = review['Subcategory'];
      if (!subcategories[subcategory]) {
        subcategories[subcategory] = 0;
      }
      subcategories[subcategory]++;
    });
    chartData.subcategories = Object.keys(subcategories).map(subcategory => ({ name: subcategory, value: subcategories[subcategory] }));
  
    setChartData(chartData);
  };

  const handleToggleCharts = () => {
    setShowCharts(!showCharts);
  };

  return (
    <Box
      sx={{
        padding: 2,
        marginLeft: { xs: 0, md: `${drawerWidth}px` },
        marginTop: '8px',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: '1200px',
          minHeight: '600px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
                {uploadStatus && (
          <AlertBox>
            <Typography variant="body2">
              {uploadStatus}
            </Typography>
          </AlertBox>
        )}
        {user && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            marginBottom: '16px',
            textAlign: 'center',
            fontSize: { xs: '1rem', md: '1.25rem' },
          }}
        >
          Welcome, {user.name}!
        </Typography>
      )}
        <Box
          sx={{
            position: 'absolute',
            top: 40,
            left: 20,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img src={dashboardIcon} alt="Dashboard Icon" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          >
            Dashboard
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            paddingTop: '80px',
            paddingBottom: '60px',
          }}
        >
          <Typography
            variant="body2"
            gutterBottom
            sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, fontStyle: 'italic' }}
          >
            Upload your CSV or Excel file to get started.
          </Typography>
          <UploadBox
            onClick={handleIconClick}
            onDrop={handleFileDrop}
            onDragOver={handleFileDragOver}
          >
            <img src={UploadIcon} alt="Upload Icon" style={{ width: '60px', height: '60px' }} />
            <Typography
              variant="body1"
              sx={{ textAlign: 'center', fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: '500', color: '#333' }}
            >
              Drag & drop your file here or click to upload
            </Typography>
          </UploadBox>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          {isAnalyzing && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '20px',
              }}
            >
              <CircularProgress size={24} />
              <Typography
                variant="body2"
                sx={{ marginLeft: '10px', fontSize: { xs: '0.75rem', md: '0.875rem' } }}
              >
                Analyzing...
              </Typography>
            </Box>
          )}
          {!isAnalyzing && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '20px',
              }}
            >
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isAnalyzing}
              >
                Analyze
              </Button>
              <Button
                onClick={handleDownloadExcel}
                sx={{ marginTop: '10px' }}
                disabled={!results || results.length === 0}
              >
                Download Results
              </Button>
              <Button
                onClick={handleToggleCharts}
                sx={{ marginTop: '10px' }}
                disabled={!results || results.length === 0}
              >
                Toggle Charts
              </Button>
            </Box>
          )}
          {showCharts && (
            <Box
              sx={{
                width: '100%',
                maxWidth: '800px',
                margin: '20px auto',
              }}
            >
              <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={chartData.identifiedIssues}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={chartData.subcategories}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
              {/* <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: '10px' }}>
                Sentiment Analysis
              </Typography> */}
              <br />
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                {/* <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Positive Reviews
                  </Typography>
                  <Typography variant="body1">
                    {chartData.positiveReviews}
                  </Typography>
                </Box> */}
                {/* <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Negative Reviews
                  </Typography>
                  <Typography variant="body1">
                    {chartData.negativeReviews}
                  </Typography>
                </Box> */}
               <Box sx={{
                      textAlign: 'center',
                      backgroundColor: '#f5f5f5',
                      padding: '20px',
                      borderRadius: '8px',
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                      maxWidth: '250px',
                      margin: '0 auto'
                    }}>
                      <Typography variant="h6" sx={{
                        fontWeight: 'bold',
                        color: '#2a2a2a',
                        fontSize: '1.2rem',
                        letterSpacing: '0.5px',
                        marginBottom: '8px'
                      }}>
                        Total Reviews
                      </Typography>
                      <Typography variant="h4" sx={{
                        color: '#4caf50',
                        fontWeight: '700',
                        fontSize: '2rem',
                        letterSpacing: '0.5px',
                        marginTop: '5px'
                      }}>
                        {chartData.totalReviews}
                      </Typography>
                    </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default Premium;