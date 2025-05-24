import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
   Card,
   Row,
   Col,
   Select,
   Input,
   InputNumber,
   Button,
   Typography,
   Spin,
   Space,
   Pagination,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '../../api/api';

const { Title, Text } = Typography;
const { Option } = Select;
const API_URL = import.meta.env.VITE_API_URL;

export default function Movies({ token }) {
   const [movies, setMovies] = useState([]);
   const [genres, setGenres] = useState([]);
   const [loading, setLoading] = useState(true);

   const [selectedGenre, setSelectedGenre] = useState();
   const [titleFilter, setTitleFilter] = useState();
   const [minRating, setMinRating] = useState();
   const [maxRating, setMaxRating] = useState();
   const [sort, setSort] = useState();
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(8);
   const [total, setTotal] = useState(0);
   const [filtersChanged, setFiltersChanged] = useState(false);

   const navigate = useNavigate();

   const fetchMovies = useCallback(async () => {
      setLoading(true);
      try {
         const { data } = await api.get('/movies', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
               genre_id: selectedGenre,
               title: titleFilter,
               min_rating: minRating,
               max_rating: maxRating,
               sort,
               page,
               limit,
            },
         });
         setMovies(data.movies);
         setTotal(data.total);
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   }, [
      token,
      selectedGenre,
      titleFilter,
      minRating,
      maxRating,
      sort,
      page,
      limit,
   ]);

   useEffect(() => {
      fetchMovies();
   }, [fetchMovies]);

   useEffect(() => {
      api.get('/genres')
         .then((res) => setGenres(res.data))
         .catch(console.error);
   }, []);

   const resetFilters = () => {
      setSelectedGenre(undefined);
      setTitleFilter('');
      setMinRating(undefined);
      setMaxRating(undefined);
      setSort(undefined);
      setPage(1);
      setFiltersChanged(false);
   };

   const handleFilterChange = () => {
      setFiltersChanged(true);
   };

   return (
      <Card style={{ maxWidth: 1200, margin: '24px auto' }}>
         <Space
            wrap
            style={{
               marginBottom: 16,
               justifyContent: 'space-between',
               width: '100%',
            }}
         >
            <Title level={2} style={{ margin: 0 }}>
               Movies
            </Title>
            {token && (
               <Space>
                  <Link to='/add-movie'>
                     <Button type='primary' icon={<PlusOutlined />}>
                        Add Movie
                     </Button>
                  </Link>
                  <Link to='/genres'>
                     <Button>Manage Genres</Button>
                  </Link>
               </Space>
            )}
         </Space>

         <Space wrap style={{ marginBottom: 16 }}>
            <Select
               allowClear
               placeholder='Genre'
               style={{ width: 150 }}
               value={selectedGenre}
               onChange={(value) => {
                  setSelectedGenre(value);
                  handleFilterChange();
               }}
            >
               {genres.map((g) => (
                  <Option key={g.id} value={g.id}>
                     {g.name}
                  </Option>
               ))}
            </Select>
            <Input
               placeholder='Search title'
               style={{ width: 200 }}
               value={titleFilter}
               onChange={(e) => {
                  setTitleFilter(e.target.value);
                  handleFilterChange();
               }}
            />
            <InputNumber
               placeholder='Min rating'
               min={0}
               max={10}
               step={0.1}
               value={minRating}
               onChange={(value) => {
                  setMinRating(value);
                  handleFilterChange();
               }}
            />
            <InputNumber
               placeholder='Max rating'
               min={0}
               max={10}
               step={0.1}
               value={maxRating}
               onChange={(value) => {
                  setMaxRating(value);
                  handleFilterChange();
               }}
            />
            <Select
               allowClear
               placeholder='Sort by'
               style={{ width: 160 }}
               value={sort}
               onChange={(value) => {
                  setSort(value);
                  handleFilterChange();
               }}
            >
               <Option value='rating_asc'>Rating ↑</Option>
               <Option value='rating_desc'>Rating ↓</Option>
               <Option value='title_asc'>Title ↑</Option>
               <Option value='title_desc'>Title ↓</Option>
            </Select>

            {filtersChanged && (
               <Button onClick={resetFilters} type='default'>
                  Reset Filters
               </Button>
            )}
         </Space>

         {loading ? (
            <div style={{ textAlign: 'center', padding: 50 }}>
               <Spin size='large' />
            </div>
         ) : (
            <Row gutter={[16, 16]}>
               {movies.map((m) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={m.id}>
                     <Card
                        hoverable
                        cover={
                           <img
                              alt={m.title}
                              src={
                                 m.cover_url
                                    ? `${API_URL}${m.cover_url}`
                                    : 'https://via.placeholder.com/300x450'
                              }
                              style={{
                                 height: 300,
                                 objectFit: 'cover',
                                 maxWidth: '100%',
                                 margin: 'auto',
                              }}
                           />
                        }
                        onClick={() => navigate(`/movies/${m.id}`)}
                     >
                        <Card.Meta
                           title={m.title}
                           description={
                              <>
                                 <Text>Rating: {m.rating.toFixed(1)}</Text>
                                 <br />
                                 <Text>Genre: {m.genre?.name || '—'}</Text>
                              </>
                           }
                        />
                     </Card>
                  </Col>
               ))}
            </Row>
         )}

         <Pagination
            style={{ marginTop: 16, textAlign: 'right' }}
            current={page}
            pageSize={limit}
            total={total}
            onChange={(p, size) => {
               setPage(p);
               setLimit(size);
            }}
            pageSizeOptions={[4, 8, 12, 20, 40]}
            showSizeChanger
         />
      </Card>
   );
}
