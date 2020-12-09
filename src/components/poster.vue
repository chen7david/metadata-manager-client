<template>
    <v-hover v-show="isVisible" absolute v-slot="{ hover }" >
        <v-card tile :width="width" color="transparent" elevation="0">
            <v-card tile dark elevation="0">
                <!-- CARC TOP TOOLBAR -->
                <v-toolbar dense absolute class="flex-grow-0" color="transparent" elevation="0">
                    <v-icon v-if="isSelected" :size="iconsize">mdi-checkbox-marked-circle</v-icon>
                </v-toolbar>
                <!-- CARD IMAGE -->
                <v-lazy :options="{threshold: 0.5}">
                    <v-img :src="src" :aspect-ratio="aspect" @error="error" @load="done">
                        <!-- CARD IMAGE LOAD SPINNER -->
                        <v-row class="fill-height" align="center" justify="center">
                            <v-progress-circular 
                                v-if="imgLoading" 
                                indeterminate 
                                :color="spinner_color"
                            ></v-progress-circular>
                        </v-row>
                    </v-img>
                </v-lazy>
                <!-- CARD OVERLAY -->
                <v-overlay :z-index="ZIndex" absolute :value="hover && !isLoading && !imgLoading">
                    <v-sheet :width="width" :height="height" color="transparent" class="d-flex flex-column">
                        <!-- TOP TOOLBAR -->
                        <v-toolbar dense class="flex-grow-0" color="transparent" elevation="0">
                            <v-icon v-if="!isSelected" :size="iconsize" @click="select" @mouseover="hoverSelect = true" @mouseleave="hoverSelect = false">
                                mdi-checkbox-blank-circle{{outline}}
                            </v-icon>
                            <v-icon v-if="isSelected" :size="iconsize" @click="deselect">
                                mdi-checkbox-marked-circle
                            </v-icon>
                            <v-spacer></v-spacer>
                            <slot name="tr" v-bind:prop="{iconsize, load}"/>
                        </v-toolbar>
                        <!-- MID-SECTION -->
                        <v-row justify="center" class="flex-grow-1">
                            <slot name="body" v-bind:prop="{iconsize, load}"/>
                        </v-row>
                        <!-- BOTTOM TOOLBAR -->
                        <v-toolbar dense class="flex-grow-0" color="transparent" elevation="0">
                            <slot name="bl" v-bind:prop="{iconsize, load}"/>
                            <v-spacer></v-spacer>
                            <slot name="br" v-bind:prop="{iconsize, load}"/>
                        </v-toolbar>
                    </v-sheet>
                </v-overlay>
            </v-card>
            <v-card-subtitle v-if="!imgLoading" class="text-left pa-0">
                <slot name="footer" v-bind:prop="{iconsize, load}"/>
            </v-card-subtitle>
        </v-card>
    </v-hover>
</template>

<script>
export default {
    name: 'poster',
    props: {
        item: null,
        keyphrase: null,
        src: null,
        width: null,
        ratio: null, 
        spinner: null,
        iconSize: null,
        zIndex: null,
    },
    data: () => ({
        isLoading: false,
        isSelected: false,
        isVisible: true,
        hoverPlay: false,
        hoverSelect: false,
        imgDone: false,
        imgError: false,
    }),
    computed: {
        aspect(){ return this.ratio || 2/3 },
        height(){ return this.width/this.aspect },
        imgLoading(){ return !this.imgError && !this.imgDone || this.isLoading },
        spinner_color(){ return this.spinner || 'orange' },
        iconsize(){ return this.iconSize || 20},
        outline(){ return this.hoverSelect ? ``:`-outline`},
        ZIndex(){ return this.zIndex || 1},
    },
    methods: {
        done(){ this.imgDone = true },
        error(){ this.imgError = true },
        select(){
            this.isSelected = true
            this.$emit('select', this.item)
        },
        deselect(){
            this.isSelected = false
            this.$emit('deselect', this.item)
        },
        hide(){ this.isVisible = false },
        show(){ this.isVisible = true },
        async load(func, params = {}){
            this.isLoading = true
            const data = await func(params)
            this.isLoading = false
            return data
        },
    },
}
</script>