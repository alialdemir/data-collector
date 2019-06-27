import List from '../components/List';
import { mapState } from 'vuex';
export default {
  components: {
    List,
  },
  data() {
    return {
      isLoading: true,
      hasError: false,
    };
  },
  watch: {
    selectedProjectId() {
      this._fetchData();
    },
  },
  computed: {
    ...mapState(['selectedProjectId']),
  },
  created() {
    this._fetchData();
  },
  methods: {
    async _fetchData() {
      this.isLoading = true;
      if (this.fetchData && parseInt(this.selectedProjectId, 10) !== 0) {
        try {
          await this.fetchData();
          this.hasError = false;
        } catch (e) {
          console.log(e);
          this.hasError = true;
        }
      }
      this.isLoading = false;
    },
  },
};
