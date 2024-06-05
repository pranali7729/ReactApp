import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Grid,
    Card,
    CardMedia,
    Typography,
    CircularProgress,
    TextField,
    Button,
    Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Search as SearchIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const BackgroundContainer = styled('div')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(https://img.freepik.com/free-photo/blue-wall-background_53876-88663.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: -1,
    opacity: 0.5,
});

const SearchBar = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
}));

const StyledCard = styled(Card)({
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
    },
    '&:hover img': {
        opacity: 0.7,
    },
});

const StyledCardMedia = styled(CardMedia)({
    transition: 'opacity 0.3s ease-in-out',
});

const DogGallery = () => {
    const [dogs, setDogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [breed, setBreed] = useState('');
    const [filteredDogs, setFilteredDogs] = useState([]);

    useEffect(() => {
        fetchDogImages();
    }, []);

    const fetchDogImages = () => {
        setLoading(true);
        axios.get('https://api.thedogapi.com/v1/images/search?limit=50&has_breeds=true&api_key=live_wfQ0rsO3JxkGbbXFxMso11yYOe1w9o3NH3kF9OWvW66OQrZZOtNq8zsyz3xYKqKM')
            .then(response => {
                console.log(response.data); 
                setDogs(response.data);
                setFilteredDogs(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
                setLoading(false);
            });
    };

    const handleSearch = (event) => {
        setBreed(event.target.value);
        const searchQuery = event.target.value.toLowerCase();
        const filtered = dogs.filter(dog => 
            dog.breeds && dog.breeds.some(b => b.name.toLowerCase().includes(searchQuery))
        );
        setFilteredDogs(filtered);
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', padding: '2rem 0' }}>
            <BackgroundContainer />
            <Container maxWidth="md" style={{ marginTop: '2rem', position: 'relative', zIndex: 1 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Dog Image Gallery
                </Typography>
                <SearchBar>
                    <SearchIcon style={{ marginRight: '8px' }} />
                    <TextField
                        label="Search by Breed"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={handleSearch}
                        value={breed}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<RefreshIcon />}
                        onClick={fetchDogImages}
                        style={{ marginLeft: '8px' }}
                    >
                        Refresh
                    </Button>
                </SearchBar>
                {loading ? (
                    <CircularProgress style={{ display: 'block', margin: '2rem auto' }} />
                ) : (
                    <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                        {filteredDogs.length > 0 ? (
                            filteredDogs.map(dog => (
                                <Grid item xs={12} sm={6} md={4} key={dog.id}>
                                    <StyledCard>
                                        <StyledCardMedia
                                            component="img"
                                            height="200"
                                            image={dog.url}
                                            alt="Dog"
                                        />
                                        {dog.breeds && dog.breeds[0] && (
                                            <Typography variant="h6" component="div" style={{ padding: '8px' }}>
                                                {dog.breeds[0].name}
                                            </Typography>
                                        )}
                                    </StyledCard>
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="h6" style={{ margin: '2rem auto' }}>
                                No dogs found for this breed.
                            </Typography>
                        )}
                    </Grid>
                )}
            </Container>
        </div>
    );
};

export default DogGallery;
