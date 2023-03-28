require('dotenv').config();


const {
    containsColors,
    containsSizes,
    containsIndependentDesignerDresses,
    applyFilters,
  } = require('./itemController');
  
  describe('itemController', () => {
    describe('containsColors', () => {
      it('returns true if no colors are provided', () => {
        expect(containsColors(null, { color: 'red' })).toBe(true);
      });
  
      it('returns false if the product has no color', () => {
        expect(containsColors('red', { color: null })).toBe(false);
      });
  
      it('returns true if the product color is in the selected colors', () => {
        expect(containsColors('red,blue', { color: 'red' })).toBe(true);
      });
  
      it('returns false if the product color is not in the selected colors', () => {
        expect(containsColors('red,blue', { color: 'green' })).toBe(false);
      });
    });
  
    describe('containsSizes', () => {
      it('returns true if no sizes are provided', () => {
        expect(containsSizes(null, { size: 'M' })).toBe(true);
      });
  
      it('returns false if the product has no size', () => {
        expect(containsSizes('M', { size: null })).toBe(false);
      });
  
      it('returns true if the product size is in the selected sizes', () => {
        expect(containsSizes('M,L', { size: 'M' })).toBe(true);
      });
  
      it('returns false if the product size is not in the selected sizes', () => {
        expect(containsSizes('M,L', { size: 'S' })).toBe(false);
      });
    });
  
    describe('containsIndependentDesignerDresses', () => {
      it('returns true if no independent filter is provided', () => {
        expect(containsIndependentDesignerDresses(null, { independent_designer_dress: true })).toBe(true);
      });
  
      it('returns false if the product has null independent_designer_dress value', () => {
        expect(containsIndependentDesignerDresses(true, { independent_designer_dress: null })).toBe(false);
      });
  
      it('returns true if the product is an independent designer dress and the filter is on', () => {
        expect(containsIndependentDesignerDresses(true, { independent_designer_dress: true })).toBe(true);
      });
  
      it('returns false if the product is not an independent designer dress and the filter is on', () => {
        expect(containsIndependentDesignerDresses(true, { independent_designer_dress: false })).toBe(false);
      });
    });
  
    describe('applyFilters', () => {
      const products = [
        {
          name: 'Red Dress',
          color: 'red',
          size: 'M',
          price: 5000,
          independent_designer_dress: true,
        },
        {
          name: 'Blue Dress',
          color: 'blue',
          size: 'L',
          price: 6000,
          independent_designer_dress: false,
        },
        {
            name: 'Green Dress',
            color: 'green',
            size: 'S',
            price: 7000,
            independent_designer_dress: true,
          },
        ];
    
        it('applies query filter correctly', async () => {
          const filters = { query: 'red' };
          const result = await applyFilters(products, filters);
          expect(result).toHaveLength(1);
          expect(result[0].name).toBe('Red Dress');
        });
    
        it('applies color filter correctly', async () => {
            const filters = { colors: 'red,blue' };
            const result = await applyFilters(products, filters);
            expect(result).toHaveLength(2);
            
            const colorResults = result.map(item => item.color);
            expect(colorResults).toContain('red');
            expect(colorResults).toContain('blue');
          });
          
          it('applies size filter correctly', async () => {
            const filters = { sizes: 'M,L' };
            const result = await applyFilters(products, filters);
            expect(result).toHaveLength(2);
            
            const sizeResults = result.map(item => item.size);
            expect(sizeResults).toContain('M');
            expect(sizeResults).toContain('L');
          });
    
        it('applies independent designer dress filter correctly', async () => {
          const filters = { independentFilter: true };
          const result = await applyFilters(products, filters);
          expect(result).toHaveLength(2);
          expect(result[0].independent_designer_dress).toBe(true);
          expect(result[1].independent_designer_dress).toBe(true);
        });
    
        it('applies price filters correctly', async () => {
            const filters = { minPrice: 55, maxPrice: 65 }; 
            const result = await applyFilters(products, filters);
            expect(result).toHaveLength(1);
            expect(result[0].price).toBe(6000);
          });
    
        it('applies multiple filters correctly', async () => {
          const filters = { colors: 'red', sizes: 'M', independentFilter: true };
          const result = await applyFilters(products, filters);
          expect(result).toHaveLength(1);
          expect(result[0].name).toBe('Red Dress');
        });
      });
    });
    
  