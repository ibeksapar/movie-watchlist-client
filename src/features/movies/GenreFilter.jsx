import { Select } from 'antd';

const { Option } = Select;

export default function GenreFilter({ genres, value, onChange }) {
   return (
      <Select
         placeholder='Filter by genre'
         allowClear
         style={{ width: 200 }}
         value={value}
         onChange={onChange}
      >
         {genres.map((g) => (
            <Option key={g.id} value={g.id}>
               {g.name}
            </Option>
         ))}
      </Select>
   );
}
